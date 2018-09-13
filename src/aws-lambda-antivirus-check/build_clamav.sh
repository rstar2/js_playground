#!/usr/bin/env bash
echo "-- Cleanup ClamAV local folder --"
rm -rf clamav
mkdir -p clamav

echo "-- Download AmazonLinux image --"
docker pull amazonlinux

echo "-- Create AmazonLinux container from the image --"
docker create -it -v ${PWD}/clamav:/home/docker --name clamav-builder amazonlinux

echo "-- Start the AmazonLinux container --"
docker start clamav-builder

echo "-- Update download and unpack ClamAV and ClamAV update inside the container --"
docker exec -it -w /home/docker clamav-builder yum install -y cpio yum-utils
docker exec -it -w /home/docker clamav-builder yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
docker exec -it -w /home/docker clamav-builder yum-config-manager --enable epel
docker exec -it -w /home/docker clamav-builder yumdownloader -x \*i686 --archlist=x86_64 clamav clamav-lib clamav-update
docker exec -it -w /home/docker clamav-builder /bin/sh -c "echo 'folder content' && ls -la"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio clamav-0*.rpm | cpio -idmv"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio clamav-lib*.rpm | cpio -idmv"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio clamav-update*.rpm | cpio -idmv"

echo "-- Stop the AmazonLinux container --"
docker stop clamav-builder
echo "-- Remove the AmazonLinux container --"
docker rm clamav-builder

echo "-- Cleanup Bin local folder --"
rm -rf bin
mkdir -p bin

echo "-- Copythe executables and required libraries from ClamAV to Bin folder--"
cp clamav/usr/bin/clamscan clamav/usr/bin/freshclam clamav/usr/lib64/* bin/.

echo "-- Clean up ClamAV folder so just the Bin is present --"
rm -rf clamav

