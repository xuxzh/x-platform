import {
  ITableDisplay,
  RhSafeAny,
  XExportFileHeaderInfo,
  XExportFileStyle,
  WithNil,
  IDisplay,
} from '@x/base/model';
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as XLSXD from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { isNil } from 'lodash';

type RhMimeType = 'text/plain' | 'application/json' | string;

export class FileHelper {
  /**
   * 通过get方法获取二进制文件流(TXT格式)
   */
  public static GetFileText(
    url: string,
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        }
  ): Observable<any> {
    return (window as any).http.get(url, { responseType: 'text', params });
  }

  /**
   * 通过Post方法获取文件文本信息
   * @param url 接口地址
   * @param body 表体，可传入后端定义的参数
   */
  public static PostFileText(url: string, body: any): Observable<any> {
    return (window as any).http.post(url, body, { responseType: 'text' });
  }

  /**
   * 通过get方法获取二进制文件流
   */
  public static GetFileBlob(
    url: string,
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        }
  ): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'octet-stream');
    return (window as any).http.get(url, {
      headers,
      responseType: 'blob',
      params,
    });
  }

  /**
   * 通过post方法获取文件
   * @param url 接口地址
   * @param body 表体
   * @param params http表头参数
   */
  public static PostFileBlob(
    url: string,
    body?: any,
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        }
  ): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'octet-stream');
    return (window as any).http.post(url, body, {
      headers,
      responseType: 'blob',
      params,
    });
  }

  /**
   * 创建blob的下载地址
   * @param blob blob数据
   */
  public static CreateDownloadFileUrl(blob: Blob): string {
    const data = new Blob([blob], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(data);
    return url;
  }

  /**
   * 创建blob的安全的下载地址(防止浏览器提示不安全的链接导致无法打开)
   * @param blob blob数据
   */
  public static CreateDownloadTrustUrl(blob: Blob): any {
    const url = this.CreateDownloadFileUrl(blob);
    return (window as any).sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // // 自动下载文件
  // public static AutoDownloadFile(content: Blob, fileName: string): void {
  //   const downloadUrl = this.CreateDownloadFileUrl(content);
  //   const fileDownloadLink = document.createElement('a');
  //   fileDownloadLink.href = downloadUrl;
  //   fileDownloadLink.setAttribute('download', fileName);
  //   document.body.appendChild(fileDownloadLink);
  //   fileDownloadLink.click();
  // }

  /**
   * 通过get的方式下载文件
   * @param url 后端提供，通过`get`访问该`url`可以获取blbo数据，参见`CreateDownloadFileUrl`方法
   * @param fileName 文件名称，必须知道文件后缀，否则无法解析。
   */
  public static downloadFileViaGet(url: string, fileName: string) {
    this.GetFileBlob(url).subscribe((result) => {
      const tempUrl = this.CreateDownloadFileUrl(result);
      const anchor = document.createElement('a');
      anchor.download = fileName;
      anchor.href = tempUrl;
      anchor.click();
    });
  }

  /**
   *
   * @param content url:;
   * @param fileName
   */
  public static AutoDownloadFile(content: Blob, fileName?: string): void {
    const downloadUrl = this.CreateDownloadFileUrl(content);
    const fileDownloadLink = document.createElement('a');
    fileDownloadLink.href = downloadUrl;
    if (fileName) {
      fileDownloadLink.setAttribute('download', fileName);
    }
    document.body.appendChild(fileDownloadLink);
    fileDownloadLink.click();
  }

  /**
   * 通过post的方式下载文件
   * @param url 转化blob获得的网址，参见`CreateDownloadFileUrl`方法
   * @param fileName 文件名称，必须知道文件后缀，否则无法解析。
   */
  public static async downloadFileViaPost(
    url: string,
    body: any,
    fileName: string
  ) {
    // 验证是否这一步花费时间最多？？
    const result = await this.PostFileBlob(url, body).toPromise();
    const tempUrl = this.CreateDownloadFileUrl(result as Blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = tempUrl;
    anchor.click();
  }

  // 打印标签文件
  public static PrintLabelFile(labelContent: any): void {
    const html = `<!DOCTYPE html>
	                <head>
	               	<title></title>
		              <meta charset="utf-8"/>
	                </head>
	                <body bgcolor="LightBlue" onload="window.print();" style="text-align:center;">
	                ${labelContent}
	                <br/>
                  </body>
                  </html>
                 `;
    const popupWindow = window.open(
      '',
      '_blank',
      'width=600,height=700,scrollbars=no,menubar=no,' +
        'toolbar=no,location=no,status=no,titlebar=no'
    );
    popupWindow?.document.open();
    popupWindow?.document.write(html);
    popupWindow?.document.close();
  }

  /**
   * 新版客户端唤醒
   * @param userIp 用户ip
   * @usage 使用方法
   * `location.href=FileHelper.getPrintLabelClientUrlLatest(userIp)`
   * @description 唤醒字符串形如：`YgLabelPrint://${userIp}`
   */
  static getPrintLabelClientUrlNew(userIp: string): string {
    return `YgLabelPrint://${userIp}`;
  }

  /** 直接使用`userip`进行唤醒打印插件
   * @usage 使用方法
   * `location.href=FileHelper.getPrintLabelClientUrlLatest(userIp)`
   * @description 唤醒字符串形如:userIp
   */
  static getPrintLabelClientUrlLatest(userIp: string): string {
    return userIp;
  }

  //#region 文件导出区域
  /**
   * 将网页中的table数据导出为excel
   * @param dataset 前端Table对应的数据源（当无数据时禁止导出）
   * @param tableName 要导出的table在html中的id值，必须设置
   * @param fileName 设置导出文件名称
   */
  static exportTableData(dataset: any[], tableName: string, fileName: string) {
    if (dataset && dataset.length > 0) {
      const tableElem = document.getElementById(tableName);
      if (tableElem) {
        const fileType = {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        };
        const blob = new Blob([tableElem.innerHTML], fileType);
        if (!fileName.endsWith('.xls')) {
          fileName += '.xls';
        }
        saveAs(blob, fileName);
      } else {
        console.warn('该Table不存在，请检查传入的Table名称是否正确');
      }
    } else {
      console.warn('表格中无数据，导出操作终止！');
    }
  }

  /**
   * 使用sheetjs导出excel
   * @param dataset 要导出的数据列表
   * @param filename 文件名称
   * @param sheetname excel数据表名称
   * @param mappedDatas 中英文对照表
   */
  static exportExcelFile(
    dataset: any[],
    filename: string,
    sheetname: string,
    mappedDatas?: ITableDisplay[]
  ): Promise<boolean> {
    // 此处不能直接reutrn Promise。否则打包的时候会报错
    const myPromise: Promise<boolean> = new Promise((resolve) => {
      let exportItem = [];
      // 做一些中文的转化
      if (mappedDatas && mappedDatas.length) {
        dataset.map((ele) => {
          const temp: Record<string, RhSafeAny> = {};
          for (const key in ele) {
            if (Object.prototype.hasOwnProperty.call(ele, key)) {
              const newKey = this.getRelatedDisplayName(key, mappedDatas);
              if (newKey) {
                temp[newKey] = ele[key];
              }
            }
          }
          exportItem.push(temp);
        });
      } else {
        exportItem = dataset;
      }
      const header: RhSafeAny[] = Object.values(exportItem[0]); // columns name
      const headerkey = Object.keys(exportItem[0]); // columns name
      const wscols = [];
      // 设置column的宽度
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < header.length; i++) {
        // columns length added
        // console.log(header[i].toString().length);
        if (header[i] === null) {
          wscols.push({ wch: headerkey[i].toString().length + 5 });
        } else {
          if (header[i].toString().length < 4) {
            wscols.push({ wch: headerkey[i].toString().length + 5 });
          } else {
            wscols.push({ wch: header[i].toString().length + 12 });
          }
        }
      }
      // this.item是一个数组，包含需要导出的内容
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportItem);
      worksheet['!cols'] = wscols;
      const workbook: XLSX.WorkBook = {
        Sheets: { [sheetname]: worksheet },
        SheetNames: [sheetname],
      };

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      filename = `${filename}_${format(
        new Date(Date.now()),
        'yyyyMMddHHmmss'
      )}`;
      this.saveAsExcelFile({ buffer: excelBuffer, fileName: filename });
      resolve(true);
    });
    return myPromise;
  }

  /**
   * 使用sheetjs导出表格数据
   * @param dataset 要导出的数据列表
   * @param headerInfos 列信息
   * @param fileStyle 样式信息
   * @param sheetName sheet表名称
   * @param filename 文件名
   * @description //TODO: 图片的导出
   */
  static exportTableDataToExcelFile(
    dataset: RhSafeAny[],
    headerInfos: XExportFileHeaderInfo[],
    fileStyle: WithNil<XExportFileStyle>,
    sheetName: string,
    filename: WithNil<string>
  ) {
    /** 表头数据 */
    const headerData: RhSafeAny[] = [];
    /** 表体数据 */
    const aoaData: RhSafeAny[][] = dataset.map((item) => []);
    /** 列数据 */
    const wscols: XLSXD.ColInfo[] = [];
    /**
     * 根据数据值计算列宽
     * @param value 文本数据
     * @returns
     */
    function getCellWidth(value: RhSafeAny) {
      // 判断是否为null或undefined
      if (value == null) {
        return 10;
      } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        // 中文的长度
        const chineseLength = value.match(/[\u4e00-\u9fa5]/g).length;
        // 其他不是中文的长度
        const otherLength = value.length - chineseLength;
        return chineseLength * 2.5 + otherLength * 1.3;
      } else {
        return value.toString().length * 1.3;
      }
    }
    /**
     * 根据原始值计算生成实际值
     * @param value 原始值
     * @param header 当前列信息
     * @param map 管道数据
     * @returns
     */
    function calcValue(
      value: RhSafeAny,
      header: XExportFileHeaderInfo,
      map: Map<RhSafeAny, RhSafeAny>
    ) {
      //不正常的值，直接返回空字符串
      if (typeof value === 'function' || typeof value === 'symbol') return '';
      //检查是否为日期类型的数据
      if (header.FieldValueType === 'dateTime') {
        try {
          if (value === null /*  || value === 0 */) return ''; //new Date(null)等于1970年1月1号，因此要先排除掉。new Date(0)等于1970年1月1日，暂不处理，就放着输出出来。
          if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            value instanceof Date
          ) {
            //只接受字符串、数字、日期类型的数据，其余数据当做异常处理，返回''
            return format(
              new Date(value),
              header.DateFormat || 'yyyy-MM-dd HH:mm'
            );
          } else {
            return ''; //其余类型数据，直接返回''
          }
        } catch (error) {
          //new Date("")等异常数据之类的，是会报错的，然后走到这里。
          return typeof value == 'object' ? '' : value;
        }
      }
      //检查是否为布尔类型
      if (header.FieldValueType === 'boolean')
        return (
          ({ 0: '否', 1: '是', false: '否', true: '是' } as RhSafeAny)[value] ||
          value ||
          ''
        );
      //其余直接检查管道数据
      if (map.has(value)) return map.get(value);
      //最后，空数据需要返回空字符串，否则Excel打开时会报错，触发自动修复。非空数据，如果是对象，就JSON一下再返回，反之直接返回。
      return isNil(value)
        ? ''
        : typeof value == 'object'
        ? JSON.stringify(value)
        : value;
    }
    //遍历表头数据
    headerInfos.forEach((header) => {
      //如果字段key不存在，则跳过。
      if (!header.FieldName) return;
      /** 当前列的管道数据 */
      const map = new Map(
        (header.PipeDatas || []).map((item) => [item.name, item.displayName])
      );
      //初始化管道数据
      //放入当前表头项
      headerData.push({
        v: header.FieldDisplayName || header.FieldName,
        t: 's',
        s: {
          font: {
            name: '宋体',
            sz: 12,
            bold: true,
          },
          fill: {
            fgColor: { rgb: 'c0c0c0' },
          },
          alignment: {
            horizontal: 'center', //"top","bottom"
            vertical: 'center', //"top","bottom"
            wrapText: false,
          },
        },
      });
      //存放该列每项数据的宽度
      const columnWidths: number[] = [
        getCellWidth(header.FieldDisplayName || header.FieldName),
      ]; //计算最大宽度时，要连带表头的宽度也比较进去
      //遍历数据，放入该列的每行数据
      dataset.forEach((data, index) => {
        //计算当前单元格的值
        const value = calcValue(
          data[header.FieldName as RhSafeAny],
          header,
          map
        );
        //放入当前单元格
        aoaData[index].push({
          v: value, //值
          t: 's', //类型, `s`表示string类型，`n`表示number类型，`b`表示boolean类型，`d`表示date类型
          s: {
            //样式.有xlsx-js-style库提供支持，xlsx库需要充钱才能有样式配置功能
            font: {
              name: '宋体',
              sz: 12, //字体大小
            },
            alignment: {
              horizontal: 'center', //"top","bottom"
              vertical: 'center', //"top","bottom"
              wrapText: false,
            },
          },
        });
        //放入当前单元格的列宽
        columnWidths.push(getCellWidth(value));
      });
      //添加列数据
      wscols.push({ wch: Math.max(...columnWidths) }); //取最宽的数据项的宽度为列宽
    });
    //初始化Sheet页
    const worksheet: XLSXD.WorkSheet = XLSXD.utils.aoa_to_sheet([
      headerData,
      ...aoaData,
    ]); //放入表头和表体数据
    //设置列数据
    worksheet['!cols'] = wscols;
    //初始化数据簿
    const workbook: XLSXD.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    };
    //生成数据
    const excelBuffer: any = XLSXD.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //配置文件名
    filename =
      filename ||
      `${filename}_${format(new Date(Date.now()), 'yyyyMMddHHmmss')}`;
    //生成文件下载
    this.saveAsExcelFile({ buffer: excelBuffer, fileName: filename });
  }

  static saveAsExcelFile({
    buffer,
    fileName,
  }: {
    buffer: any;
    fileName: string;
  }) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, fileName + '.xlsx');
  }

  static getRelatedDisplayName(
    name: string,
    mappedDatas: ITableDisplay[]
  ): string | null {
    const target = mappedDatas.find((ele) => ele.field === name);
    return target ? (target?.header as string) : null;
  }
  //#endregion 文件导出区域结束

  //#region （前端导出）导出文件数据可格式化区域开始
  /**
   * 使用sheetjs导出excel(可格式化数据的导出（前端导出）)
   * @param dataset 要导出的数据列表
   * @param filename 文件名称
   * @param sheetname excel数据表名称
   * @param mappedDatas 中英文对照表
   */
  static formatExportExcelFile(
    dataset: any[],
    filename: string,
    sheetname: string,
    mappedDatas?: ITableDisplay[]
  ): Promise<boolean> {
    // 此处不能直接reutrn Promise。否则打包的时候会报错
    const myPromise: Promise<boolean> = new Promise((resolve) => {
      let exportItem = [];
      // 做一些中文的转化
      if (mappedDatas && mappedDatas.length) {
        dataset.map((ele) => {
          let temp = {};
          for (const key in ele) {
            if (Object.prototype.hasOwnProperty.call(ele, key)) {
              temp = this.exportDataHandler(key, mappedDatas, ele, temp);
            }
          }
          exportItem.push(temp);
        });
      } else {
        exportItem = dataset;
      }
      const header: RhSafeAny[] = Object.values(exportItem[0]); // columns name
      const headerkey = Object.keys(exportItem[0]); // columns name
      const wscols = [];
      // 设置column的宽度
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < header.length; i++) {
        // columns length added
        // console.log(header[i].toString().length);
        if (header[i] === null) {
          wscols.push({ wch: headerkey[i].toString().length + 5 });
        } else {
          if (header[i].toString().length < 4) {
            wscols.push({ wch: headerkey[i].toString().length + 5 });
          } else {
            wscols.push({ wch: header[i].toString().length + 12 });
          }
        }
      }
      // this.item是一个数组，包含需要导出的内容
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportItem);
      worksheet['!cols'] = wscols;
      const workbook: XLSX.WorkBook = {
        Sheets: { [sheetname]: worksheet },
        SheetNames: [sheetname],
      };

      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      filename = `${filename}_${format(
        new Date(Date.now()),
        'yyyyMMddHHmmss'
      )}`;
      this.saveAsExcelFile({ buffer: excelBuffer, fileName: filename });
      resolve(true);
    });
    return myPromise;
  }

  static exportDataHandler(
    key: string,
    mappedDatas: ITableDisplay[],
    ele: Record<string, RhSafeAny>,
    temp: Record<string, RhSafeAny>
  ): Record<string, RhSafeAny> {
    const target = mappedDatas.find((ele) => ele.field === key);
    if (target) {
      // 添加bool类型数据处理
      if (target.type === 'boolean') {
        temp[target.header] = ele[key] ? '是' : '否';
      } else {
        if (Array.isArray(target.pipeDatas)) {
          const item = target.pipeDatas.find(
            (f: IDisplay) => ele[key] === f.name
          );
          if (item) {
            temp[target.header] = item.displayName;
          } else {
            temp[target.header] = ele[key];
          }
        } else if (target.pipe) {
          temp[target.header] = target.pipe(ele[key]);
        } else {
          temp[target.header] = ele[key];
        }
      }
    } else {
      // temp[key] = ele[key];
    }
    return temp;
  }

  //#endregion 导出文件数据可格式化区域结束

  //#region base download function区域

  /**
   * 通过url直接下载，模拟点击
   * @param url 目标base64数据
   * @deprecated 该方法已废弃，请使用`downloadBase64Directly`方法
   */
  static downloadDirect(url: string) {
    const aTag = document.createElement('a');
    // download为filename
    aTag.download = url.split('/').pop() as string;
    aTag.href = url;
    aTag.click();
  }

  /**
   * 通过url直接下载，模拟点击
   * @param url 目标base64数据
   * @deprecated 该方法已废弃，请使用`downloadBase64Directly`方法
   */
  static downloadBase64Directly(url: string) {
    const aTag = document.createElement('a');
    // download为filename
    aTag.download = url.split('/').pop() as string;
    aTag.href = url;
    aTag.click();
  }
  /**
   * 使用后端提供的url。模拟点击超链接进行下载
   * @param url 后端提供的url,需要在浏览器中直接输入就能下载文件。
   * @param fileName 文件名，选填
   */
  static downloadUrlDirectly(url: string, fileName?: string) {
    const anchor = document.createElement('a');
    if (fileName) {
      anchor.download = fileName;
    }
    anchor.href = url;
    anchor.click();
  }

  /**
   *
   * @param content 数据源,如JSON数据
   * @param filename 文件名称,如：hello.json,hello.txt
   * @param type 文件类型(MIME 类型)
   */
  static downloadByContent(
    content: RhSafeAny,
    filename: string,
    type: RhMimeType
  ) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    const blob = new Blob([content], { type });
    const blobUrl = URL.createObjectURL(blob);
    aTag.href = blobUrl;
    aTag.click();
    URL.revokeObjectURL(blobUrl);
  }

  static downloadByDataUrl(
    content: RhSafeAny,
    filename: string,
    type: RhMimeType
  ) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    const dataUrl = `data:${type};base64,${window.btoa(
      unescape(encodeURIComponent(content))
    )}`;
    aTag.href = dataUrl;
    aTag.click();
  }

  static downloadByBlob(blob: Blob, filename: string) {
    const aTag = document.createElement('a');
    aTag.download = filename;
    const blobUrl = URL.createObjectURL(blob);
    aTag.href = blobUrl;
    aTag.click();
    URL.revokeObjectURL(blobUrl);
  }

  static base64ToBlob(base64: string, type: RhMimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const buffer = Uint8Array.from(byteNumbers);
    const blob = new Blob([buffer], { type });
    return blob;
  }

  static base64ToFile(base64: string, filename: string) {
    const arr = base64.split(',');
    // 从base64的数据中获取type
    const mime = arr[0].match(/:(.*?);/)?.[1] as string;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  /** 将文件或者blob转换成base64
   * @description 读取成功会返回base64信息，读取失败后会返错误信息
   * @param data:blob或者file对象
   */
  static blobOrFileToBase64(
    data: Blob | File
  ): Promise<string | ArrayBuffer | null> {
    const p: Promise<string | ArrayBuffer | null> = new Promise(function (
      resolve,
      reject
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(data as RhSafeAny);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (e) => {
        reject(`读取文件失败!${e}`);
      };
    });
    return p;
  }
  //#endregion base download function区域结束
}
