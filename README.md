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
copy <from> <to> [--ignore <file or folder>]
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
```

### ~ Special Commands ~
```bash
:pipe <file>
```
```bash
:each folder
```
```bash
:each file
```
```bash
:open <file>
```
```bash
:eval <code>
```
```bash
:if <conditions>
```
```bash
:if <conditions>
:begin
    <instructions here>
:end
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
