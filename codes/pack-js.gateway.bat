for /f %%i in (js_list.gateway.txt) do type %%i >> fj.gateway.min.js

java -jar ../pkgs/yuicompressor-2.4.8.jar -v --type js --charset utf-8 fj.gateway.min.js -o fj.gateway.min.js