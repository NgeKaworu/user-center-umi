import React from 'react';

import { Form, Button } from 'antd';
import { FormProps } from 'antd/lib/form';

export default (props: FormProps) => {
  return (
    <Form {...props}>
      {props.children}
      <Form.Item style={{ visibility: 'hidden' }}>
        <Button htmlType="submit"></Button>
      </Form.Item>
    </Form>
  );
};
