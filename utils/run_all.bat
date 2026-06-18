@echo off
echo Running all required scripts...
node initStnData_rkl.js
node initStnData_mrt.js
node initStnData_rpg.js
post_cleanup