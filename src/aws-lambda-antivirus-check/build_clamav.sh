#!/usr/bin/env bash
echo "-- Cleaning up ClamAV folder --"
rm -rf clamav
mkdir -p clamav

echo "-- Downloading AmazonLinux container --"
docker pull amazonlinux
docker create -i -t -v ${PWD}/clamav:/home/docker  --name s3-antivirus-builder amazonlinux
docker start s3-antivirus-builder

echo "-- Updating, downloading and unpacking clamAV and ClamAV update --"
docker exec -it -w /home/docker s3-antivirus-builder yum install -y cpio yum-utils
docker exec -it -w /home/docker s3-antivirus-builder yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
docker exec -it -w /home/docker s3-antivirus-builder yum-config-manager --enable epel
docker exec -it -w /home/docker s3-antivirus-builder yumdownloader -x \*i686 --archlist=x86_64 clamav clamav-lib clamav-update
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "echo 'folder content' && ls -la"
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "rpm2cpio clamav-0*.rpm | cpio -idmv"
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "rpm2cpio clamav-lib*.rpm | cpio -idmv"
docker exec -it -w /home/docker s3-antivirus-builder /bin/sh -c "rpm2cpio clamav-update*.rpm | cpio -idmv"

docker stop s3-antivirus-builder
docker rm s3-antivirus-builder

rm -rf bin
mkdir -p bin

echo "-- Copying the executables and required libraries --"
cp clamav/usr/bin/clamscan clamav/usr/bin/freshclam clamav/usr/lib64/* bin/.

echo "-- Cleaning up ClamAV folder --"
rm -rf clamav
