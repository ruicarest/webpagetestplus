cd ../uikit

rm -rf custom
mkdir custom

xcopy "../webpagetestplus/src/lib/uikit/custom" "custom" /s/h/e/k/f/c/y

start /wait yarn compile

ls dist/css/

xcopy "dist/css/uikit.wptplus.*" "../webpagetestplus/src/lib/uikit/css" /s/h/e/k/f/c/y

cd ../webpagetestplus