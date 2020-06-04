// Copyright 2020 Carnegie Mellon University. All Rights Reserved.
// Released under a 3 Clause BSD-style license. See LICENSE.md in the project root for license information.

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolbarService } from '../../svc/toolbar.service';
import { WorkspaceService } from '../../../api/workspace.service';
import { Search, WorkspaceSummary } from '../../../api/gen/models';
import { UserService } from '../../../svc/user.service';
import { SettingsService } from '../../../svc/settings.service';
import { debounceTime, map, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './workspace-lobby.component.html',
  styleUrls: ['./workspace-lobby.component.scss']
})
export class WorkspaceLobbyComponent implements OnInit, OnDestroy {

  none = false;
  hasMore = false;
  showAdd = false;
  showGames = false;
  fetching = false;
  list = new Array<WorkspaceSummary>();
  model: Search = { sort: 'age', take: 25 };
  filter = '';
  hasProfile = false;
  subs: Array<Subscription> = [];
  firstQuery = true;

  constructor(
    private toolbarSvc: ToolbarService,
    private workspaceSvc: WorkspaceService,
    private userSvc: UserService,
    private settingsSvc: SettingsService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.userSvc.profile$.pipe(
        debounceTime(500),
        map(p => !!p.id))
        .subscribe(
          p =>  {
            this.hasProfile = p;
            if (p) { this.initToolbar(); }
            this.model.sort = this.settingsSvc.localSettings.lobbySort || 'age';
            const f = !!this.settingsSvc.localSettings.lobbyFilter
              ? this.settingsSvc.localSettings.lobbyFilter
              : p ? 'private' : 'public';

            if (f !== this.filter) {
              this.filterChanged({ value: f });
            }
          }
      ),

      this.toolbarSvc.term$.subscribe(
        (term: string) => {
          this.model.term = term;
          this.fetch_fresh();
        }
      )
    );

    this.toolbarSvc.search(true);

  }

  initToolbar() {
    this.toolbarSvc.addButtons([{
      icon: 'add_circle',
      text: 'New Workspace',
      clicked: () => this.showAdd = !this.showAdd,
    }]);
  }

  ngOnDestroy() {
    this.toolbarSvc.reset();
    this.subs.forEach(s => s.unsubscribe());
  }

  fetch_fresh(): void {
    this.model.skip = 0;
    this.fetch();
  }

  fetch(): void {
    if (!this.model.filter || !this.model.filter.length) {
      return;
    }

    this.fetching = true;
    this.workspaceSvc.list(this.model)
    .pipe(
      finalize(() => this.fetching = false)
    )
    .subscribe(
      (data: WorkspaceSummary[]) => {
        if (this.model.skip > 0) {
          this.list.concat(data);
        } else {
          this.list = data;
        }
        this.none = !this.list.length;
        this.model.skip += data.length;
        this.hasMore = data.length === this.model.take;
        if (this.firstQuery && this.none && this.model.filter.indexOf('private') >= 0) {
          setTimeout(() => {
            this.filterChanged({value: 'public'});
          }, 100);
        }
        this.firstQuery = false;
      }
    );
  }

  filterChanged(e): void {
    if (e.value) {
      this.settingsSvc.updateLobbyFilter(e.value);
      this.filter = e.value;
      this.model.filter = [ e.value ];
      this.fetch_fresh();
    }
  }

  sortChanged(e): void {
    this.settingsSvc.updateLobbySort(e.value);
    this.fetch_fresh();
  }

  hasSomeGames(v: boolean): void {
    this.showGames = v;
  }

  trackById(item: WorkspaceSummary): number {
    return item.id;
  }
}
