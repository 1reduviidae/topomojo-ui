// Copyright 2020 Carnegie Mellon University. All Rights Reserved.
// Released under a 3 Clause BSD-style license. See LICENSE.md in the project root for license information.

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TemplateService } from '../../../api/template.service';
import { TemplateDetail } from '../../../api/gen/models';

@Component({
  selector: 'topomojo-template-creator',
  templateUrl: './template-creator.component.html',
  styleUrls: ['./template-creator.component.scss']
})
export class TemplateCreatorComponent implements OnInit {
  @Output() created = new EventEmitter<TemplateDetail>();
  name = '';

  constructor(
    private templateSvc: TemplateService
  ) { }

  ngOnInit() {
  }

  clicked() {
    this.templateSvc.createDetail({ name: this.name, networks: 'lan'}).subscribe(
      (t: TemplateDetail) => {
        this.created.emit(t);
        this.name = '';
      }
    );
  }
}
