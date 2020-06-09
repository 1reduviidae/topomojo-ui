// Copyright 2020 Carnegie Mellon University. All Rights Reserved.
// Released under a 3 Clause BSD-style license. See LICENSE.md in the project root for license information.

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vm, Search } from '../../../api/gen/models';
import { VmService } from '../../../api/vm.service';
import { ToolbarService } from '../../svc/toolbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'topomojo-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit, OnDestroy {
  current = '';
  vms: Array<Vm> = [];
  search: Search = { take: 20 };
  hasMore = false;
  subs: Array<Subscription> = [];

  constructor(
    private vmSvc: VmService,
    private toolbar: ToolbarService
  ) { }

  ngOnInit() {

    this.subs.push(
      this.toolbar.term$.subscribe(
        (term: string) => {
          this.search.term = term;
          this.fetch();
        }
      )
    );
    this.toolbar.search(true);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.toolbar.reset();
  }

  fetch() {
    this.search.skip = 0;
    this.vms = [];
    this.more();
  }

  more() {
    this.vmSvc.list(this.search.term).subscribe(
      (data: Array<Vm>) => {
        this.vms = data;
        // this.search.skip += data.length;
        // this.hasMore = data.length === this.search.take;
      }
    );
  }

  select(vm: Vm) {
    this.current = (this.current !== vm.id) ? vm.id : '';
  }

  vmRefreshed(vm: Vm, e: Vm) {
    if (!e.id) {
      this.current = '';
      this.vms.splice(this.vms.indexOf(vm), 1);
    }
  }

  trackById(i: number, item: Vm): string {
    return item.id;
  }

}
