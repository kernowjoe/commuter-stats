const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSass = new ExtractTextPlugin({filename: 'bundle.[hash].css'});


module.exports = {
    entry:  {
        bundle: './src/js/app.js'
    },
    output: {
        filename: 'bundle.[hash].js',
        path:     path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use:  extractSass.extract(
                    {
                        fallback: 'style-loader',
                        use:      ['css-loader', 'sass-loader']
                    })
            },
            {
                test:   /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|otf|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'

            },

        ]
    },

    plugins: [
        extractSass,
        new HtmlWebpackPlugin(
            {
                template: 'src/index.html'
            }
        ),
        new CopyWebpackPlugin(
            [
                {from: 'src/assets', to: 'assets'},
                {from: 'src/netlify'}
            ]
        )

    ]


};