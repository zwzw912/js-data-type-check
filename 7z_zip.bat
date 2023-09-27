@echo off

for /f %%a in ('hostname') do set h=%%a
del .\*.7z
set zip=C:\Program Files\7-Zip\7z.exe

"%zip%" a js-data-type-check.7z *.mjs .\dist .\src .\test .\.gitignore .\*.js .\*.json .\*.md .\*.bat
pause