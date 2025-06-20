@echo off
rmdir /s /q .git
rmdir /s /q client
rmdir /s /q src
mkdir temp
move public\* temp\
rmdir /s /q public
ren temp public
