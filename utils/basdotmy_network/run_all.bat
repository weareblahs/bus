@echo off
@REM NOTE: Script requires wget (preinstalled on win10+) and 7-zip File Manager
echo Downloading required files...
wget -O mybas-kangar.zip "https://api.data.gov.my/gtfs-static/mybas-kangar"
md mybas-kangar
tar -xf mybas-kangar.zip -C "mybas-kangar"
wget -O mybas-alor-setar.zip "https://api.data.gov.my/gtfs-static/mybas-alor-setar"
md mybas-alor-setar
tar -xf mybas-alor-setar.zip -C "mybas-alor-setar"
wget -O mybas-kota-bharu.zip "https://api.data.gov.my/gtfs-static/mybas-kota-bharu"
md mybas-kota-bharu
tar -xf mybas-kota-bharu.zip -C "mybas-kota-bharu"
wget -O mybas-kuala-terengganu.zip "https://api.data.gov.my/gtfs-static/mybas-kuala-terengganu"
md mybas-kuala-terengganu
tar -xf mybas-kuala-terengganu.zip -C "mybas-kuala-terengganu"
wget -O mybas-ipoh.zip "https://api.data.gov.my/gtfs-static/mybas-ipoh"
md mybas-ipoh
tar -xf mybas-ipoh.zip -C "mybas-ipoh"
wget -O mybas-seremban-a.zip "https://api.data.gov.my/gtfs-static/mybas-seremban-a"
md mybas-seremban-a
tar -xf mybas-seremban-a.zip -C "mybas-seremban-a"
wget -O mybas-seremban-b.zip "https://api.data.gov.my/gtfs-static/mybas-seremban-b"
md mybas-seremban-b
tar -xf mybas-seremban-b.zip -C "mybas-seremban-b"
wget -O mybas-melaka.zip "https://api.data.gov.my/gtfs-static/mybas-melaka"
md mybas-melaka
tar -xf mybas-melaka.zip -C "mybas-melaka"
wget -O mybas-johor.zip "https://api.data.gov.my/gtfs-static/mybas-johor"
md mybas-johor
tar -xf mybas-johor.zip -C "mybas-johor"
wget -O mybas-kuching.zip "https://api.data.gov.my/gtfs-static/mybas-kuching"
md mybas-kuching
tar -xf mybas-kuching.zip -C "mybas-kuching"
echo Deleting original files...
del mybas-kangar.zip -y
del mybas-alor-setar.zip -y
del mybas-kota-bharu.zip -y
del mybas-kuala-terengganu.zip -y
del mybas-ipoh.zip -y
del mybas-seremban-a.zip -y
del mybas-seremban-b.zip -y
del mybas-melaka.zip -y
del mybas-johor.zip -y
del mybas-kuching.zip -y