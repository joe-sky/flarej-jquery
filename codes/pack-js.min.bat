for /f %%i in (js_list_min.txt) do type %%i >> fj.all.min.js

java -jar ../pkgs/yuicompressor-2.4.8.jar -v --type js --charset utf-8 fj.all.min.js -o fj.all.min.js