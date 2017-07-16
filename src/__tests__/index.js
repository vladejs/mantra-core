import {expect} from 'chai';
import {createApp} from '../';
import * as indexExports from '../';
import * as simpleSimpleDiExports from 'react-simple-di';

const {describe, it} = global;

describe('Module', () => {
  describe('createApp', async () => {
    it('should create app with provided args', () => {
      const context = {aa: 10};
      const app = createApp(context);
      expect(app.context).to.deep.equal(context);
    });
  });

  it('should have useDeps from react-simple-di', () => {
    expect(indexExports.useDeps).to.be.equal(simpleSimpleDiExports.useDeps);
  });
});
