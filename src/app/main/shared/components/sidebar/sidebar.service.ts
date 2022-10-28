import { Injectable } from '@angular/core';

import { FuseSidebarComponent } from './sidebar.component';

@Injectable({
    providedIn: 'root'
})
export class FuseSidebarService
{
    // Private
    private registry: { [key: string]: FuseSidebarComponent } = {};

    constructor() {}

    register(key, sidebar): void
    {
        // Check if the key already being used
        if ( this.registry[key] )
        {
            console.error(`The sidebar with the key '${key}' already exists. Either unregister it first or use a unique key.`);

            return;
        }

        // Add to the registry
        this.registry[key] = sidebar;
    }

    unregister(key): void
    {
        // Check if the sidebar exists
        if ( !this.registry[key] )
        {
            console.warn(`The sidebar with the key '${key}' doesn't exist in the registry.`);
        }

        // Unregister the sidebar
        delete this.registry[key];
    }

    getSidebar(key): FuseSidebarComponent
    {
        // Check if the sidebar exists
        if ( !this.registry[key] )
        {
            console.warn(`The sidebar with the key '${key}' doesn't exist in the registry.`);

            return;
        }

        // Return the sidebar
        return this.registry[key];
    }
}
