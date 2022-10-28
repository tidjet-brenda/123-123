import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseSidebarService } from './sidebar.service';
import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector: 'app-fuse-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseSidebarComponent implements OnInit, OnDestroy {
    @Input()
    name: string;

    @Input()
    key: string;

    @Input()
    position: 'left' | 'right';

    @HostBinding('class.open')
    opened: boolean;

    @Input()
    lockedOpen: string;

    @HostBinding('class.locked-open')
    isLockedOpen: boolean;

    @Input()
    foldedWidth: number;

    @Input()
    foldedAutoTriggerOnHover: boolean;

    @HostBinding('class.unfolded')
    unfolded: boolean;

    @Input()
    invisibleOverlay: boolean;

    @Output()
    foldedChanged: EventEmitter<boolean>;

    @Output()
    openedChanged: EventEmitter<boolean>;

    private folded2: boolean;
    private fuseConfig: any;
    private wasActive: boolean;
    private wasFolded: boolean;
    private backdrop: HTMLElement | null = null;
    private player: AnimationPlayer;
    private unsubscribeAll: Subject<any>;

    @HostBinding('class.animations-enabled')
    private animationsEnabled: boolean;

    constructor(
        private animationBuilder: AnimationBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private fuseConfigService: FuseConfigService,
        private fuseMatchMediaService: FuseMatchMediaService,
        private fuseSidebarService: FuseSidebarService,
        private mediaObserver: MediaObserver,
        private renderer: Renderer2
    ) {
        // Set the defaults
        this.foldedAutoTriggerOnHover = true;
        this.foldedWidth = 64;
        this.foldedChanged = new EventEmitter();
        this.openedChanged = new EventEmitter();
        this.opened = false;
        this.position = 'left';
        this.invisibleOverlay = false;
        // Set the private defaults
        this.animationsEnabled = false;
        this.folded2 = false;
        this.unsubscribeAll = new Subject();
    }

    @Input()
    set folded(value: boolean) {
        // Set the folded
        this.folded2 = value;
        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }
        // Programmatically add/remove padding to the element
        // that comes after or before based on the position
        let sibling;
        let styleRule;
        const styleValue = this.foldedWidth + 'px';
        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this.elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        }
        else {
            sibling = this.elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }
        // If there is no sibling, return...
        if (!sibling) {
            return;
        }

        // If folded...
        if (value) {
            // Fold the sidebar
            this.fold();
            // Set the folded width
            this.renderer.setStyle(this.elementRef.nativeElement, 'width', styleValue);
            this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', styleValue);
            this.renderer.setStyle(this.elementRef.nativeElement, 'max-width', styleValue);
            // Set the style and class
            this.renderer.setStyle(sibling, styleRule, styleValue);
            this.renderer.addClass(this.elementRef.nativeElement, 'folded');
        }
        // If unfolded...
        else {
            // Unfold the sidebar
            this.unfold();
            // Remove the folded width
            this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
            this.renderer.removeStyle(this.elementRef.nativeElement, 'min-width');
            this.renderer.removeStyle(this.elementRef.nativeElement, 'max-width');
            // Remove the style and class
            this.renderer.removeStyle(sibling, styleRule);
            this.renderer.removeClass(this.elementRef.nativeElement, 'folded');
        }
        // Emit the 'foldedChanged' event
        this.foldedChanged.emit(this.folded);
    }

    get folded(): boolean {
        return this.folded2;
    }

    ngOnInit(): void {
        this.fuseConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
        this.fuseSidebarService.register(this.name, this);
        this.setupVisibility();
        this.setupPosition();
        this.setupLockedOpen();
        this.setupFolded();
    }

    ngOnDestroy(): void {
        if (this.folded) {
            this.unfold();
        }
        this.fuseSidebarService.unregister(this.name);
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    private setupVisibility(): void {
        this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', 'none');
        this.renderer.setStyle(this.elementRef.nativeElement, 'visibility', 'hidden');
    }

    private setupPosition(): void {
        if (this.position === 'right') {
            this.renderer.addClass(this.elementRef.nativeElement, 'right-positioned');
        }
        else {
            this.renderer.addClass(this.elementRef.nativeElement, 'left-positioned');
        }
    }

    private setupLockedOpen(): void {
        // Return if the lockedOpen wasn't set
        if (!this.lockedOpen) {
            // Return
            return;
        }
        // Set the wasActive for the first time
        this.wasActive = false;
        // Set the wasFolded
        this.wasFolded = this.folded;
        // Show the sidebar
        this.showSidebar();
        // Act on every media change
        this.fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                // Get the active status
                const isActive = this.mediaObserver.isActive(this.lockedOpen);
                // If the both status are the same, don't act
                if (this.wasActive === isActive) {
                    return;
                }
                // Activate the lockedOpen
                if (isActive) {
                    // Set the lockedOpen status
                    this.isLockedOpen = true;
                    // Show the sidebar
                    this.showSidebar();
                    // Force the the opened status to true
                    this.opened = true;
                    // Emit the 'openedChanged' event
                    this.openedChanged.emit(this.opened);
                    // If the sidebar was folded, forcefully fold it again
                    if (this.wasFolded) {
                        // Enable the animations
                        this.enableAnimations();
                        // Fold
                        this.folded = true;
                        // Mark for check
                        this.changeDetectorRef.markForCheck();
                    }
                    // Hide the backdrop if any exists
                    this.hideBackdrop();
                }
                // De-Activate the lockedOpen
                else {
                    // Set the lockedOpen status
                    this.isLockedOpen = false;
                    // Unfold the sidebar in case if it was folded
                    this.unfold();
                    // Force the the opened status to close
                    this.opened = false;
                    // Emit the 'openedChanged' event
                    this.openedChanged.emit(this.opened);
                    // Hide the sidebar
                    this.hideSidebar();
                }
                // Store the new active status
                this.wasActive = isActive;
            });
    }

    private setupFolded(): void {
        // Return, if sidebar is not folded
        if (!this.folded) {
            return;
        }
        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }
        let sibling;
        let styleRule;
        const styleValue = this.foldedWidth + 'px';
        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this.elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        }
        else {
            sibling = this.elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }
        // If there is no sibling, return...
        if (!sibling) {
            return;
        }
        // Fold the sidebar
        this.fold();
        // Set the folded width
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', styleValue);
        this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', styleValue);
        this.renderer.setStyle(this.elementRef.nativeElement, 'max-width', styleValue);
        // Set the style and class
        this.renderer.setStyle(sibling, styleRule, styleValue);
        this.renderer.addClass(this.elementRef.nativeElement, 'folded');
    }

    private showBackdrop(): void {
        // Create the backdrop element
        this.backdrop = this.renderer.createElement('div');
        // Add a class to the backdrop element
        this.backdrop.classList.add('fuse-sidebar-overlay');
        // Add a class depending on the invisibleOverlay option
        if (this.invisibleOverlay) {
            this.backdrop.classList.add('fuse-sidebar-overlay-invisible');
        }
        // Append the backdrop to the parent of the sidebar
        this.renderer.appendChild(this.elementRef.nativeElement.parentElement, this.backdrop);
        // Create the enter animation and attach it to the player
        this.player =
            this.animationBuilder
                .build([
                    animate('300ms ease', style({ opacity: 1 }))
                ]).create(this.backdrop);

        // Play the animation
        this.player.play();

        // Add an event listener to the overlay
        this.backdrop.addEventListener('click', () => {
            this.close();
        }
        );
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private hideBackdrop(): void {
        if (!this.backdrop) {
            return;
        }
        // Create the leave animation and attach it to the player
        this.player =
            this.animationBuilder
                .build([
                    animate('300ms ease', style({ opacity: 0 }))
                ]).create(this.backdrop);
        // Play the animation
        this.player.play();
        // Once the animation is done...
        this.player.onDone(() => {
            // If the backdrop still exists...
            if (this.backdrop) {
                // Remove the backdrop
                this.backdrop.parentNode.removeChild(this.backdrop);
                this.backdrop = null;
            }
        });
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private showSidebar(): void {
        // Remove the box-shadow style
        this.renderer.removeStyle(this.elementRef.nativeElement, 'box-shadow');
        // Make the sidebar invisible
        this.renderer.removeStyle(this.elementRef.nativeElement, 'visibility');
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private hideSidebar(delay = true): void {
        const delayAmount = delay ? 300 : 0;
        // Add a delay so close animation can play
        setTimeout(() => {
            // Remove the box-shadow
            this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', 'none');
            // Make the sidebar invisible
            this.renderer.setStyle(this.elementRef.nativeElement, 'visibility', 'hidden');
        }, delayAmount);
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private enableAnimations(): void {
        // Return if animations already enabled
        if (this.animationsEnabled) {
            return;
        }
        // Enable the animations
        this.animationsEnabled = true;
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    open(): void {
        if (this.opened || this.isLockedOpen) {
            return;
        }
        // Enable the animations
        this.enableAnimations();
        // Show the sidebar
        this.showSidebar();
        // Show the backdrop
        this.showBackdrop();
        // Set the opened status
        this.opened = true;
        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    close(): void {
        if (!this.opened || this.isLockedOpen) {
            return;
        }
        // Enable the animations
        this.enableAnimations();
        // Hide the backdrop
        this.hideBackdrop();
        // Set the opened status
        this.opened = false;
        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);
        // Hide the sidebar
        this.hideSidebar();
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    toggleOpen(): void {
        this.opened ? this.close() : this.open();
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }
        this.unfoldTemporarily();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }
        this.foldTemporarily();
    }

    fold(): void {
        if (this.folded) {
            return;
        }
        this.enableAnimations();
        this.folded = true;
        this.changeDetectorRef.markForCheck();
    }

    unfold(): void {
        if (!this.folded) {
            return;
        }
        this.enableAnimations();
        this.folded = false;
        this.changeDetectorRef.markForCheck();
    }

    toggleFold(): void {
        this.folded ? this.unfold() : this.fold();
    }

    foldTemporarily(): void {
        if (!this.folded) {
            return;
        }
        this.enableAnimations();
        this.unfolded = false;
        const styleValue = this.foldedWidth + 'px';
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', styleValue);
        this.renderer.setStyle(this.elementRef.nativeElement, 'min-width', styleValue);
        this.renderer.setStyle(this.elementRef.nativeElement, 'max-width', styleValue);
        this.changeDetectorRef.markForCheck();
    }

    unfoldTemporarily(): void {
        if (!this.folded) {
            return;
        }
        this.enableAnimations();
        this.unfolded = true;
        this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'min-width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'max-width');
        this.changeDetectorRef.markForCheck();
    }
}
