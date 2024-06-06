import { Inject, Injectable } from '@angular/core';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import * as lodash from 'lodash';
import * as datefns from 'date-fns';
// import * as screenfull from 'screenfull';
// import * as go from 'gojs';
// import * as echarts from 'echarts';
import {
  OP_HANDLERS_DATASET_TOKEN,
  RhOpHandlersDataset,
  RhAbstractRuntime,
  OPERATIONS_DATASET_TOKEN,
  RhOperationsDataset,
  CONVERTERS_DATASET_TOKEN,
  RhConvertersDataset,
  CONVERTER_HANDLERS_DATASET_TOKEN,
  RhConverterHandlersDataset,
} from '@x/lcdp/model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  ArrayHelper,
  FileHelper,
  MsgHelper,
  ObjectHelper,
  NumberHelper,
  TreeHelper,
  RhApiConfigService,
} from '@x/base/core';
import {
  DateHelper,
  FunctionHelper,
  RhAppConfigService,
  RhStorageService,
} from '@x/base/core';
import { RhSafeAny } from '@x/base/model';
import { XOperationKeys } from '@x/lcdp/data';
import { RhOpDisplayDataHandler } from '@x/lcdp/data';
import { RhvDisplayHelper } from './display-helper.service';

@Injectable()
export class XRuntimeService<D> extends RhAbstractRuntime<D> {
  get MsgHelper() {
    return MsgHelper;
  }
  get ObjectHelper() {
    return ObjectHelper;
  }
  get NumberHelper() {
    return NumberHelper;
  }
  get ArrayHelper() {
    return ArrayHelper;
  }
  get FunctionHelper() {
    return FunctionHelper;
  }
  get FileHelper() {
    return FileHelper;
  }
  // get FlowchartHelper() {
  //   return FlowchartHelper;
  // }
  get DateHelper() {
    return DateHelper;
  }
  get TreeHelper() {
    return TreeHelper;
  }
  // get I18nHelper() {
  //   return I18nHelper;
  // }
  get rxjs() {
    return rxjs;
  }
  get operators() {
    return operators;
  }
  get lodash() {
    return (lodash as RhSafeAny)?.default || lodash;
  }
  get datefns() {
    return datefns;
  }
  // get screenfull() {
  //   return (screenfull as RhSafeAny)?.default || screenfull;
  // }
  // get go() {
  //   return go;
  // }
  // get echarts() {
  //   return echarts;
  // }
  // override displayHelper = new RhvDisplayHelper();

  // get customContents() {
  //   return RhCustomContentManager;
  // }

  override displayHelper = new RhvDisplayHelper();

  constructor(
    public http: HttpClient,
    public router: Router,
    public apiService: RhApiConfigService,
    public storageService: RhStorageService,
    public appConfigService: RhAppConfigService,
    @Inject(OP_HANDLERS_DATASET_TOKEN) public opHandlers: RhOpHandlersDataset,
    @Inject(OPERATIONS_DATASET_TOKEN) public operations: RhOperationsDataset,
    @Inject(CONVERTERS_DATASET_TOKEN) public converters: RhConvertersDataset,
    @Inject(CONVERTER_HANDLERS_DATASET_TOKEN)
    public converterHandlers: RhConverterHandlersDataset
  ) {
    super();
  }

  createSubRuntime: () => RhAbstractRuntime<RhSafeAny> = () => {
    const subRuntime = new XRuntimeService(
      this.http,
      this.router,
      this.apiService,
      this.storageService,
      this.appConfigService,
      this.opHandlers,
      this.operations,
      this.converters,
      this.converterHandlers
    );
    subRuntime.parent = this;
    subRuntime.addInstanceAuthorities(this.getInstanceAuthorities());
    return subRuntime;
  };

  _removeDisplayHelperSubscriptions = () => {
    const handler = this.opHandlers[
      XOperationKeys.DISPLAY_DATA
    ] as RhOpDisplayDataHandler;
    handler.clearSubscriptions();
  };
}
