import { Component, OnDestroy } from '@angular/core';
import { XSharedModule } from '@x/base/shared';

interface ITable {
  id: number;
  title: string;
  price: number;
  address: string;
}

@Component({
  imports: [XSharedModule],
  selector: 'xp-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.less',
  standalone: true,
})
export class TableDemoComponent implements OnDestroy {
  data: ITable[] = this.initDataset();

  initDataset() {
    const temp: ITable[] = [];
    for (let index = 0; index < 10000; index++) {
      temp.push({
        id: index,
        title: index.toString(),
        price: index,
        address: index.toString(),
      });
    }
    return temp;
  }

  reset() {
    this.data = [];
  }

  updateDataset() {
    this.data = this.data.map((ele) => {
      ele.price += 1;
      return ele;
    });
  }

  ngOnDestroy(): void {
    this.data = [];
  }
}
