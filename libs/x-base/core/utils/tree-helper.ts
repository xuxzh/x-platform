import { RhSafeAny } from '@x/base/model';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

/** node对象的key对应的数据来源对象的key */
interface mappedType {
  key: string;
  title: string;
  children: RhSafeAny;
  // customData: T;
}

// 树控件助手
export class TreeHelper {
  // 初始化节点状态 未选中，折叠
  static InitNzTreeNodes(rootTreeNode: NzTreeNode): void {
    rootTreeNode.isChecked = false;
    rootTreeNode.isExpanded = false;
    if (rootTreeNode.children.length > 0) {
      rootTreeNode.children.forEach((treeNode) => {
        treeNode.isExpanded = false;
        treeNode.isChecked = false;
        this.InitNzTreeNodes(treeNode);
      });
    }
  }

  // 获取选中的节点列表集合
  static GetCheckedTreeNodeList(rootTreeNode: NzTreeNode): NzTreeNode[] {
    const nodeList: NzTreeNode[] = [];
    if (rootTreeNode.isChecked) {
      nodeList.push(rootTreeNode);
    }
    if (rootTreeNode.children.length > 0) {
      rootTreeNode.children.forEach((treeNode) => {
        this.addCheckedTreeNodes(treeNode, nodeList);
      });
    }
    return nodeList;
  }

  // 移除树的节点
  static RemoveTreeNode(treeNode: NzTreeNode): void {
    const parentNode = treeNode.parentNode;
    if (parentNode) {
      const childNodes = parentNode.getChildren();
      const index = childNodes.findIndex((f) => f.key === treeNode.key);
      childNodes.splice(index, 1);
    } else {
      treeNode.remove();
    }
  }

  /** 清除菜单的选中和开启状态 */
  static clearStatus(
    node: NzTreeNodeOptions | NzTreeNodeOptions[],
    clearSelect = true,
    clearOpen = true
  ) {
    if (node == null) {
      return;
    }
    if (node instanceof Array) {
      if (node.length) {
        node.forEach((ele) => {
          this.clearStatus(ele);
        });
      }
    } else {
      if (clearSelect) {
        node.selected = false;
      }
      if (clearOpen) {
        node['open'] = false;
      }
      if (node.children && node.children.length) {
        node.children.forEach((ele) => {
          this.clearStatus(ele, clearSelect, clearOpen);
        });
      }
    }
  }

  /** 清除树的选中和展开状态 */
  public static clearTreeStatus(
    targetNode: NzTreeNode | NzTreeNode[],
    clearSelect = true,
    clearOpen = true,
    exceptNode?: NzTreeNode
  ) {
    if (targetNode instanceof Array) {
      targetNode.forEach((node) => {
        this.clearTreeStatus(node, clearSelect, clearOpen, exceptNode);
      });
      return;
    }
    if (clearSelect && targetNode !== exceptNode) {
      targetNode.isSelected = false;
    }
    if (clearOpen && targetNode !== exceptNode) {
      targetNode.isSelected = false;
    }
    if (targetNode.children) {
      targetNode.children.forEach((node) => {
        this.clearTreeStatus(node, clearSelect, clearOpen, exceptNode);
      });
    }
  }

  /**
   * 递归折叠树或指定的树节点
   * @param node 树节点或者树的数据源
   */
  public static collapseTree(
    node: NzTreeNode | NzTreeNode[],
    expandKey = 'isExpanded'
  ) {
    if (Array.isArray(node)) {
      node.forEach((ele) => {
        this.collapseTree(ele, expandKey);
      });
    } else {
      (node as RhSafeAny)[expandKey] = false;
      if (node.children && node.children.length) {
        this.collapseTree(node.children, expandKey);
      }
    }
  }

  /**
   * 递归树展开树节点
   * @param node 树节点或者树的数据源
   */
  public static ExpandTree(
    node: NzTreeNode | NzTreeNode[],
    expandKey = 'isExpanded'
  ) {
    if (Array.isArray(node)) {
      node.forEach((ele) => {
        this.ExpandTree(ele, expandKey);
      });
    } else {
      (node as RhSafeAny)[expandKey] = true;
      if (node.children && node.children.length) {
        this.ExpandTree(node.children, expandKey);
      }
    }
  }

  /** 选中所有的父节点
   * @deprecated 该功能不合理，不建议使用
   */
  static checkParentNode(node: NzTreeNode) {
    if (node.isChecked && node.parentNode) {
      node.parentNode.isChecked = true;
      this.checkParentNode(node.parentNode);
    }
  }

  /**
   * 根据父节点递归获取子节点的节点数组
   * @param node 父节点
   * @param expectParent 是否包含父节点
   */
  static getNodeDatasetViaParentNode(
    node: NzTreeNode,
    expectParent = false
  ): NzTreeNode[] {
    const tempDatas: NzTreeNode[] = [];
    if (!expectParent) {
      tempDatas.push();
    }
    this.getNodeChildrenDataset(node, tempDatas);
    return tempDatas;
  }

  private static getNodeChildrenDataset(node: NzTreeNode, temp: NzTreeNode[]) {
    //
    if (node?.children?.length) {
      node.children.forEach((ele) => {
        temp.push(ele);
        this.getNodeChildrenDataset(ele, temp);
      });
    }
  }

  // 添加选中的树节点
  private static addCheckedTreeNodes(
    treeNode: NzTreeNode,
    nodeList: NzTreeNode[]
  ): void {
    if (treeNode.isChecked) {
      nodeList.push(treeNode);
    }
    if (treeNode.children.length > 0) {
      treeNode.children.forEach((node) => {
        // 注释防止重复添加
        // if (node.isChecked) {
        //   nodeList.push(node);
        // }
        this.addCheckedTreeNodes(node, nodeList);
      });
    }
  }

  /**
   * 转换数据源为组件节点数组
   * @param dataSource 数据源
   * @param mappedKeys 转换字段映射对应key
   */
  public static transformToNodes<T extends Record<string, RhSafeAny>>(
    dataSource: T[],
    mappedKeys: mappedType,
    isLeaf?: boolean
  ) {
    const dataNodes: NzTreeNode[] = [];
    dataSource.forEach((data) => {
      const length = data[mappedKeys.children]
        ? data[mappedKeys.children].length
        : 0;
      const rootNode = new NzTreeNode({
        key: data[mappedKeys.key],
        title: data[mappedKeys.title],
        isLeaf: length ? false : isLeaf ? true : false,
        customData: data,
      });
      dataNodes.push(this.transformToSignalNode(rootNode, mappedKeys, data));
    });
    return dataNodes;
  }

  /**
   * 通过节点key，获取指定节点数据
   * @param dataNodes 节点数据源
   * @param selectedNodeKeys 已选中节点Key
   */
  public static getSelectedNodes(
    dataNodes: NzTreeNode[],
    selectedNodeKeys: string[]
  ) {
    const selectedNodes: NzTreeNode[] = [];
    dataNodes.forEach((node) => {
      if (selectedNodeKeys.includes(node.key)) {
        selectedNodes.push(node);
      }
      if (node.children && node.children.length) {
        selectedNodes.push(
          ...TreeHelper.getSelectedNodes(node.children, selectedNodeKeys)
        );
      }
    });
    return selectedNodes;
  }

  /**
   * 获取指定节点的所有父节点数据
   * @param selectedNode 选中的节点
   */
  static getAllParentNodes(selectedNode: NzTreeNode) {
    const parentNodes: NzTreeNode[] = [];
    if (selectedNode.parentNode) {
      parentNodes.push(selectedNode.parentNode);
      if (selectedNode.parentNode.parentNode) {
        parentNodes.push(
          ...TreeHelper.getAllParentNodes(selectedNode.parentNode)
        );
      }
    }
    return parentNodes;
  }

  /**
   * 通过父节点数据，递归返回添加所有子节点的父节点
   * @param parentNode 父节点
   * @param mappedData 转换字段映射组
   * @param data 父节点对应数据
   */
  static transformToSignalNode<T extends Record<string, RhSafeAny>>(
    parentNode: NzTreeNode,
    mappedData: mappedType,
    data: T
  ) {
    const childNodes: NzTreeNode[] = [];
    if (data[mappedData.children] && data[mappedData.children].length > 0) {
      data[mappedData.children].forEach((nodeData: RhSafeAny) => {
        const length = nodeData[mappedData.children]
          ? nodeData[mappedData.children].length
          : 0;
        const treeNode = new NzTreeNode(
          {
            title: nodeData[mappedData.title],
            key: nodeData[mappedData.key],
            isLeaf: length ? false : true,
            customData: nodeData,
          },
          parentNode
        );
        childNodes.push(treeNode);
        this.transformToSignalNode(treeNode, mappedData, nodeData);
      });
      parentNode.addChildren(childNodes);
    }
    return parentNode;
  }
}
