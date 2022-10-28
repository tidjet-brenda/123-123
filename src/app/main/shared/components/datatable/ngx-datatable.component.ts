import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
@Component({
    selector: 'app-docs-components-third-party-ngx-datatable',
    templateUrl: './ngx-datatable.component.html',
    styleUrls: ['./ngx-datatable.component.scss']
})
export class DocsComponentsThirdPartyNgxDatatableComponent implements OnInit, OnChanges, OnDestroy {

    checkIfRubricSystem: any;

    @Input()
    rows: any[];
    @Input()
    columns: any[];
    @Input() actions: any[];

    @Input() pageIndex: any;

    @Input() waiting: any;

    @Input() unite: string;

    @Input() pageCount: any;

    @Input() totalItems: any;

    @Input() status: any;
    
    @Input() statusStatus: boolean;

    @Input() externalSorting = true;

    @Input() externalPaging = true;

    @Input()
    pictureStatus: any;
    @Input()
    isLeaveFilter = false;
    @Input()
    position: any;
    @Input() noRequests: any;


    @Output()
    singleFilter: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    selectionChanged: EventEmitter<any> = new EventEmitter<any>();

    loadingIndicator: boolean;
    reorderable: boolean;
    isVisible = true;

    // Private
    private unsubscribeAll: Subject<any>;


    @Output()
    emitActionOnTable: EventEmitter<any> = new EventEmitter<any>();
    @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    changePage = new EventEmitter();
    @Output()
    sortData = new EventEmitter();
    @Output()
    filter: EventEmitter<any> = new EventEmitter<any>();


    messages: any;
    filtersTable: any[] = [];
    select: -1;

    constructor(
        private httpClient: HttpClient,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private translateService: TranslateService,
        private fuseTranslationLoader: FuseTranslationLoaderService
    ) {
        
        // Set the defaults
        this.loadingIndicator = true;
        this.reorderable = true;

        // Set the private defaults
        this.unsubscribeAll = new Subject();
        document.addEventListener('click', (e) => {
            this.recalculateColumns();
        });
        document.addEventListener('resize', (e) => {
            this.recalculateColumns();
        });
        document.addEventListener('mousemove', (e) => {
            this.recalculateColumns();
        });
        iconRegistry.addSvgIcon
            ('filterDropdown', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-icons/filter.svg'));
         
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.fuseTranslationLoader.loadTranslations(fr, dz);
        this.messages = {
            // Message to show when array is presented
            // but contains no values
            emptyMessage: 'Aucune donnée',

            // Footer total message
            totalMessage: this.unite,

            // Footer selected message
            selectedMessage: ''
        };

    }

    ngOnChanges(): void {
        this.messages = {
            // Message to show when array is presented
            // but contains no values
            emptyMessage: this.noRequests !== '' ? this.noRequests : 'Aucune donnée',

            // Footer total message
            totalMessage: this.unite,

            // Footer selected message
            selectedMessage: ''
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
    onSelect(row) {
        this.rowSelected.emit(row.selected[0]);
    }
    ActionOnTable(action, r, i) {
        const act = {
            actionType: action,
            row: r,
            item: i,
        };
        this.emitActionOnTable.emit(act);
    }

    pageEmiter(e) {

        this.changePage.next(e.offset);
        window.scroll(0, 0); window.scroll(0, 0);
    }

    waitingLeaves(event) {
        if (event !== null) {
            this.isVisible = true;
            this.waiting = event ? event : 0;

        }

    }

    recalculateColumns() {
        if (this.rows) {
            this.rows = [...this.rows];
        }
    }

    onSelectedRow(event) {
        this.rowSelected.emit(event.selected[0]);
    }

    sortEmiter(e) {
        const sort = {
            direction: e.sorts[0].dir,
            item: e.sorts[0].prop
        };
        this.sortData.next(sort);
    }

    changerFilter(event, item) {
        this.filtersTable = null;
        if (event === true) {
            this.filtersTable.push(item);
        }
        this.filter.emit(this.filtersTable);
    }

    onFilterSingleStatus(event, i) {
        if (event === true) {
            this.singleFilter.emit(i);
        } else {
            i = null;
            this.singleFilter.emit(i);
        }
    }

}
