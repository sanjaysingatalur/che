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
import {IPackage, ISearchResults, NpmRegistry} from '../../../../../components/api/npm-registry.factory';
import {WorkspaceDetailsToolsService} from '../workspace-details-tools.service';

const THEIA_PLUGINS = 'THEIA_PLUGINS';

/**
 * @ngdoc controller
 * @name workspaces.details.tools.controller:WorkspaceDetailsToolsIdeController
 * @description This class is handling the controller for details of workspace ide tool.
 * @author Ann Shumilova
 */
export class WorkspaceToolsIdeController {
  static $inject = ['npmRegistry', 'lodash', 'cheListHelperFactory', '$scope', 'workspaceDetailsToolsService'];
  packageOrderBy = 'name';
  packages: Array<IPackage>;
  packagesSummary: ISearchResults;
  packagesFilter: any;
  workspaceDetailsToolsService: WorkspaceDetailsToolsService;
  environmentVariables: { [envVarName: string]: string } = {};
  plugins: Array<string>;


  private cheListHelper: che.widget.ICheListHelper;


  /**
   * Default constructor that is using resource
   */
  constructor(npmRegistry: NpmRegistry, lodash: any, cheListHelperFactory: che.widget.ICheListHelperFactory,
              $scope: ng.IScope, workspaceDetailsToolsService: WorkspaceDetailsToolsService) {
    const helperId = 'workspace-tools-ide';
    this.workspaceDetailsToolsService = workspaceDetailsToolsService;

    this.cheListHelper = cheListHelperFactory.getHelper(helperId);
    $scope.$on('$destroy', () => {
      cheListHelperFactory.removeHelper(helperId);
    });
    this.packagesFilter = {name: ''};

    npmRegistry.search('keywords:theia-extension').then((data: ISearchResults) => {
      this.packagesSummary = data;
      this.packages = lodash.pluck(this.packagesSummary.results, 'package');
      this.packages.forEach((_package: IPackage) => {
        _package.isEnabled = this.isPackageEnabled(_package.name);
      });
      this.cheListHelper.setList(this.packages, 'name');
    });

    let machine = this.workspaceDetailsToolsService.getCurrentMachine();
    this.environmentVariables = this.workspaceDetailsToolsService.getEnvironmentManager().getEnvVariables(machine);
    this.plugins = machine && this.environmentVariables[THEIA_PLUGINS] ? this.environmentVariables[THEIA_PLUGINS].split(',') : [];
  }


  /**
   * Callback when name is changed.
   *
   * @param str {string} a string to filter projects names
   */
  onSearchChanged(str: string): void {
    this.packagesFilter.name = str;
    this.cheListHelper.applyFilter('name', this.packagesFilter);
  }

  updatePackage(_package: IPackage): void {
    if (_package.isEnabled) {
      this.plugins.push(_package.name);
    } else {
      this.plugins.splice(this.plugins.indexOf(_package.name), 1);
    }

    let machine = this.workspaceDetailsToolsService.getCurrentMachine();
    this.environmentVariables[THEIA_PLUGINS] = this.plugins.join(',');
    this.workspaceDetailsToolsService.getEnvironmentManager().setEnvVariables(machine, this.environmentVariables);
    this.workspaceDetailsToolsService.getChangeCallback()();
  }

  private isPackageEnabled(name: string): boolean {
    return this.plugins.indexOf(name) >= 0;
  }
}
