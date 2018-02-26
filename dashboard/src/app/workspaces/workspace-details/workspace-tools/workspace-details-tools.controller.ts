/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';
import {WorkspaceDetailsToolsService} from './workspace-details-tools.service';
import {IEnvironmentManagerMachine} from '../../../../components/api/environment/environment-manager-machine';
import {EnvironmentManager} from '../../../../components/api/environment/environment-manager';

/**
 * @ngdoc controller
 * @name workspaces.details.tools.controller:WorkspaceDetailsToolsController
 * @description This class is handling the controller for details of workspace : section tools
 * @author Ann Shumilova
 */
export class WorkspaceDetailsToolsController {
  static $inject = ['workspaceDetailsToolsService', '$scope'];
  private selectedMachine: IEnvironmentManagerMachine;
  private environmentManager: EnvironmentManager;
  private onChange: Function;
  private workspaceDetailsToolsService: WorkspaceDetailsToolsService;
  private toolType: string;
  private page: string;

  /**
   * Default constructor that is using resource
   */
  constructor(workspaceDetailsToolsService: WorkspaceDetailsToolsService, $scope: ng.IScope) {
    this.workspaceDetailsToolsService = workspaceDetailsToolsService;

    this.init(this.selectedMachine);

    const deRegistrationFn = $scope.$watch(() => {
      return this.selectedMachine;
    }, (selectedMachine: IEnvironmentManagerMachine) => {
      this.init(selectedMachine);
    }, true);

    $scope.$on('$destroy', () => {
      deRegistrationFn();
    });
  }

  init(selectedMachine: IEnvironmentManagerMachine): void {
    if (!selectedMachine) {
      return;
    }
    this.workspaceDetailsToolsService.setEnvironmentManager(this.environmentManager);
    this.workspaceDetailsToolsService.setCurrentMachine(selectedMachine);
    this.workspaceDetailsToolsService.setChangeCallback(this.onChange);
    this.toolType = this.workspaceDetailsToolsService.detectToolType(selectedMachine);
    if (this.toolType) {
      this.page = this.workspaceDetailsToolsService.getToolConfigPage(this.toolType);
    }
  }
}
