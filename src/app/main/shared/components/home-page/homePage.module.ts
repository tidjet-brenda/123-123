import { NgModule } from '@angular/core';
import { HomePageComponent } from './home-page.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [HomePageComponent],
    imports: [
        MatCarouselModule.forRoot(),
        CommonModule,
    ],
    exports: [HomePageComponent],
})
export class HomePageModule { }