rm -rf output
mkdir output

source ~/.nvm/nvm.sh
nvm install v16.13.1
nvm use v16.13.1

# npm config set registry http://npm.intra.xiaojukeji.com
npm install
npm run build

ret=$?
if [ $ret -ne 0 ];then
    echo "===== npm build failure ====="
    exit $ret
else
    echo -n "===== npm build successfully! ====="
fi

# 拷贝dockerfile及相关文件至output目录下
cp ../dockerfiles/Dockerfile output/
cp -r ../dockerfiles/ output/dockerfiles
cp -r ../build output/web
cp -f ../dockerfiles/server.conf output/
