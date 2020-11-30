<img src="https://lucianorasente.com/public_img/bhic.png" style="max-width:100px;width:100%;">

# bilderhic
Bilderhic is a smart and simple command tool for automatization.

## How does it work?
You have to create a pipe file.
Bilderhic will run the commands inside your file.
The commands of the pipe file can be Bilderhic commands, 
or bash / cmd commands.
Bilderhic includes usefull commands for edit files.

## Installation
```bash
npm i -g bilderhic
```

## Usage
```bash
bhic <file> [-vb or --verbose] [-d or --debug]

or

bhic [-vb or --verbose] [-d or --debug] [-c or --command] <single line command>
```

### ~ Bilderhic Commands ~

#### > env command

##### Description
It allows you to create / load / edit environment variables (inside your process).

##### Usage
> Set variable manually
```bash
env set <key> <value>
```

> Set variable from user input
```bash
env prompt <key> -m <message>
```

> Adds a value to a numeric variable
```bash
env add <key> <value>
```

> Load variables
```bash
env load <file.yml>
```

> File.yml example
```yaml
app:
    id: com.brand.app
    version: 2
    description: This is an awesome Android Application.
    name: Awesomapp
```

> Usage of environment variables
```bash
env load File.yml

:open config.xml
    - set widget.id=[app.id]
    - set widget.android-versionCode=[app.version]
    - set widget.version=0.0.[app.version]
    - set widget>name=[app.name]
    - set widget>description=[app.description]
    - save
    - close
```

> Clear your environment
```bash
env clear
```

> Change the debug mode
```bash
env debug <enable or disable>
```

#### > copy command

##### Description
Copies a file or a folder. Override the files if it exists.

##### Usage
```bash
copy <from> <to> [-i or --ignore <file or folder>] [-q or --quiet]
```

#### > sync command

##### Description
Synchronizes (mirror mode) two folders. Only writes the diferrences between the folders.

##### Usage
```bash
sync <source> <destination> [-i or --ignore <file or folder>] [-q or --quiet]
```

#### > del command

##### Description
Deletes a file o a folder (recursively) if exists.

##### Usage
```bash
del <file or folder>
```

#### > cd command
DOC

#### > log command
Writes a text to the configured loggers.

```bash
log [info | warn | debug | error | success] <text to log>
```

#### > mkdir command
DOC

#### > ren command
Renames a file o a folder.

##### Usage
```bash
ren <file or folder> <newName> [--skip-unexisting or -sk] [--overwrite or -o]
```


#### > base64 command

##### Description
Parses a base-64 string.

##### Usage
```bash
base64 <text>
or
base64 <text> > <filename>
or
base64 <text> >> <environment variable>
```

##### Example
```bash
base64 YmlsZGVyaGlj > mistery.txt
```

#### > cat command

##### Description
Reads a file and prints its content.

##### Usage
```bash
cat <filename>
or
cat <filename> > <filename>
or
cat <filename> >> <environment variable>
```

##### Example
```bash
base64 YmlsZGVyaGlj > mistery.txt
```

#### > run command

##### Description
Renames a file or a folder.

##### Usage
```bash
ren <origin> <target> [--overwrite or -w]
```

#### > exit command

##### Description
Stops the pipe or the process.

##### Usage
```bash
exit [pipe]
or
exit [<exit code>]
```
#### > sleep command

##### Description
Waits until timer ends.

##### Usage
```bash
sleep <time (ms)>
```

#### > beep command

##### Description
Makes a console beep sound.

##### Usage
```bash
beep [times] [delay between beeps]
```
##### Examples
```bash
echo Beep!
beep
echo Beep! Beep!
beep 2
echo Beep! ... Beep! ... Beep!
beep 3 1000
```

### ~ Special Commands ~
#### Pipe
Open a new pipe from a file
```bash
:pipe <file>
```

#### Pipe line
Open a new pipe from a line of code
```bash
:pipeline <code>
```

#### Each
Open a new pipe from a list of folders or files

```bash
:each folder
```
```bash
:each file
```

#### Logger
Adds a logger instance.
```bash
:logger add <logger type> [logger name]
```

Logger types:
* File

Example:
```bash
:logger add file
- set file logs.txt

log Hello word!
```

#### Open
Open a file editor
```bash
:open <file>
```

#### Eval
Run javacript code and saves the result to $eval (environment variable).

```bash
:eval <code>
```

Example:
```bash
:eval +(new Date())
echo [$eval]
```

#### If
If condition
```bash
:if <conditions>
```
```bash
:if <conditions>
:begin
    <instructions here>
:end
```

#### Await
Wait for all async commands to finish.

```bash
:await
```

If you want to start an async command, you need to start it with a ~ character.

Example:
```bash
run echo This is a sync command
~run echo This is an async command
:await
```

#### Bhic / Bilderhic
It does nothing. It's useful for ensure that you are running a file on Bilderhic.

```bash
!bhic
or
!bilderhic
```

## File edition
Text editors: TXT
Object editors: XML, HTML, JSON

### ~ Text editors ~
```bash
- append <text>
```
```bash
- set <line number> <text>
```
```bash
- replace <text> <replacement text>
```
```bash
- replaceone <text> <replacement text>
```
```bash
- save
```
```bash
- close
```

### ~ Object editors ~ 
```bash
- add <key>=<value>
```
```bash
- set <selector> = <value or variable>
```
```bash
- get <selector> > <variableName>
```
```bash
- save
```
```bash
- close
```

## Examples
bhic pipe.txt
bhic -c echo Hi world!
bhic pipe.txt --set myVariable=myCustomValue

## Misc
Multiple line command
```bash
bhic -c echo Running :eol: sleep 5000 :eol: beep :eol: echo Run finished
```
