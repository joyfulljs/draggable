import banner from 'rollup-plugin-banner';
import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const BannerStr =
  `<%= pkg.name %> v<%= pkg.version %>
(c) 2014-${new Date().getFullYear()} by <%= pkg.author %>
Released under the MIT License.`

export default [{
  input: 'dist/index.js',
  plugins: [resolve()],
  output: [{
    file: 'dist/draggable.min.js',
    format: 'umd',
    name: 'Draggable',
    plugins: [
      terser({
        output: {
          comments: function (node, comment) {
            const { value, type } = comment;
            if (type == "comment2") {
              return /license/i.test(value);
            }
          }
        }
      }),
      banner(BannerStr)
    ]
  }, {
    file: pkg.main,
    format: 'cjs'
  }]
}];