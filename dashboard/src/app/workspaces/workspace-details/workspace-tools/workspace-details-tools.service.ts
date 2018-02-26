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
import {CheWorkspace} from '../../../../components/api/workspace/che-workspace.factory';
import {CheNotification} from '../../../../components/notification/che-notification.factory';
import {IEnvironmentManagerMachine} from '../../../../components/api/environment/environment-manager-machine';
import {EnvironmentManager} from '../../../../components/api/environment/environment-manager';

const IDE_TOOL_TYPE: string = 'ide';

/**
 * This class is handling the data for workspace tools.
 *
 * @author Ann Shumilova
 */
export class WorkspaceDetailsToolsService {
  static $inject = ['$log', '$q', 'lodash', 'cheWorkspace', 'cheNotification'];

  /**
   * Logging service.
   */
  private $log: ng.ILogService;
  /**
   * Promises service.
   */
  private $q: ng.IQService;
  /**
   * Workspace API interaction.
   */
  private cheWorkspace: CheWorkspace;
  /**
   * Notification factory.
   */
  private cheNotification: CheNotification;

  private lodash: any;
  private toolConfigPages: Map<string, string>;
  private currentMachine: IEnvironmentManagerMachine;
  private environmentManager: EnvironmentManager;
  private changeCallback: Function;

  /**
   * Default constructor that is using resource
   */
  constructor (
    $log: ng.ILogService,
    $q: ng.IQService,
    lodash: any,
    cheWorkspace: CheWorkspace,
    cheNotification: CheNotification
  ) {
    this.$log = $log;
    this.$q = $q;
    this.lodash = lodash;
    this.cheWorkspace = cheWorkspace;
    this.cheNotification = cheNotification;
    this.toolConfigPages = new Map();
    this.addToolConfigPage(IDE_TOOL_TYPE, '<workspace-tools-ide></workspace-tools-ide>');
  }

  setCurrentMachine(machine: IEnvironmentManagerMachine): void {
    this.currentMachine = machine;
  }

  getCurrentMachine(): IEnvironmentManagerMachine {
    return this.currentMachine;
  }

  setChangeCallback(callback: Function): void {
    this.changeCallback = callback;
  }

  getChangeCallback(): Function {
    return this.changeCallback;
  }

  setEnvironmentManager(environmentManager: EnvironmentManager): void {
    this.environmentManager = environmentManager;
  }

  getEnvironmentManager(): EnvironmentManager {
    return this.environmentManager;
  }

  addToolConfigPage(type: string, page: string): void {
    this.toolConfigPages.set(type, page);
  }

  getToolConfigPage(type: string): string {
    return this.toolConfigPages.get(type);
  }

  detectToolType(machine: IEnvironmentManagerMachine): string {
    let serverAttributes = this.lodash.pluck(machine.servers, 'attributes');
    for (let i = 0; i < serverAttributes.length; i++) {
      // todo needs refinements when the way of defining tools will be implemented
      if (serverAttributes[i].type === IDE_TOOL_TYPE) {
        return IDE_TOOL_TYPE;
      }
    }
    return null;
  }
}
