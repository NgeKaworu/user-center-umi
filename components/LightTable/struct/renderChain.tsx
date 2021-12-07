import Chain from '@/struct/chain';
import type { Node } from '@/struct/chain';
import type { TableColumnProps } from 'antd';

export class RenderNode<RecordType> implements Node {
  render?: TableColumnProps<RecordType>['render'];
  next?: RenderNode<RecordType>;
  name: string | undefined;

  constructor(render?: TableColumnProps<RecordType>['render']) {
    this.render = render;
    this.name = render?.name;
  }
}

export class RenderChain<RecordType> extends Chain<RenderNode<RecordType>> {
  public Concat(c: RenderChain<RecordType>) {
    return new RenderChain<RecordType>(...this, ...c);
  }
}
