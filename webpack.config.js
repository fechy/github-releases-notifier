module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        app: './src/web/index.js',
    },
    output: {
        path: `${__dirname}/public/`,
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        modules: [__dirname, 'node_modules'],
        enforceExtension: false,
    },
    devServer: {
        contentBase: 'public/',
        publicPath: 'public/',
        inline: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx$|\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};