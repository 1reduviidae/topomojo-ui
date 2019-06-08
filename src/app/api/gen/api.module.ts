// Copyright 2019 Carnegie Mellon University. All Rights Reserved.
// Released under a 3 Clause BSD-style license. See LICENSE.md in the project root for license information.
import { AdminService } from '../admin.service';
import { ChatService } from '../chat.service';
import { ConsoleService } from '../console.service';
import { DocumentService } from '../document.service';
import { FileService } from '../file.service';
import { GamespaceService } from '../gamespace.service';
import { ProfileService } from '../profile.service';
import { TemplateService } from '../template.service';
import { TopologyService } from '../topology.service';
import { VmService } from '../vm.service';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiSettings } from '../api-settings';

@NgModule({
    imports: [ HttpClientModule ],
    providers: [
        ApiSettings,
        AdminService,
        ChatService,
        ConsoleService,
        DocumentService,
        FileService,
        GamespaceService,
        ProfileService,
        TemplateService,
        TopologyService,
        VmService
    ]
})
export class ApiModule { }
