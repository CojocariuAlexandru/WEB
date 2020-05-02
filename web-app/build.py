from os import path
from os import fsencode
from os import listdir
from os import fsdecode

from css_html_js_minify import html_minify
from jsmin import jsmin
from css_html_js_minify import css_minify

from distutils.dir_util import copy_tree
from shutil import copy2

def get_built_file_name(file_name):
    return './build/' + file_name

def check_if_file_exists(file_name):
    return path.exists(file_name)

def get_ref_file_name(line, ref):
    if ref not in line:
        return ''
    return '.' + line.split(ref)[1].split('"')[0]

def get_css_file_name(line):
    ref = 'href=\"'
    return get_ref_file_name(line, ref)

def append_css_line(line, css_file):
    css_file_name = get_css_file_name(line)
    if css_file_name == '' or not check_if_file_exists(css_file_name):
        return css_file
    print(' CSS file found: \"' + css_file_name + '\"')

    with open(css_file_name, mode = 'r') as file:
        for line in file.readlines():
            css_file = css_file + line

    return css_file

def build_css_file(app_css):
    built_css_file_name = 'style.css'
    created_file = get_built_file_name(built_css_file_name)

    with open(created_file, mode='w+') as file:
        file.write(css_minify(app_css))

    return '\t<link rel="stylesheet" type="text/css" href="/' + built_css_file_name + '">\n'

def get_js_file_name(line):
    ref = 'src=\"'
    return get_ref_file_name(line, ref)

def append_js_line(line, js_file):
    js_file_name = get_js_file_name(line)
    if js_file_name == '' or not check_if_file_exists(js_file_name):
        return js_file
    print('  JS file found: \"' + js_file_name + '\"')

    with open(js_file_name, mode = 'r') as file:
        for line in file.readlines():
            js_file = js_file + line

    return js_file

def build_js_file(app_js):
    built_js_file_name = 'script.js'
    created_file = get_built_file_name(built_js_file_name)

    with open(created_file, mode='w+') as file:
        file.write(jsmin(app_js))

    return '\t<script type="text/javascript" src="/' + built_js_file_name + '"></script>\n'

def build_web_app_pages():
    pages_dir = './pages'

    directory = fsencode(pages_dir)
    for file in listdir(directory):
        file_name = fsdecode(file)
        if file_name.endswith('.html'):
            print('HTML file found: \"./pages/' + file_name + '\"')

            page = ''
            with open(pages_dir + '/' + file_name, 'r', encoding="utf-8") as html_file:
                for line in html_file.readlines():
                    page = page + line
            with open('./build/pages/' + file_name, 'w+', encoding="utf-8") as built_html_file:
                built_html_file.write(html_minify(page))

def build_web_app(main_file):
    start_css = '<!--start-styles-->'
    end_css = '<!--end-styles-->'
    start_js = '<!--start-scripts-->'
    end_js = '<!--end-scripts-->'

    new_css_file_content = ''
    new_js_file_content = ''

    built_main_main = get_built_file_name(main_file)
    with open(main_file, mode='r') as file_index:
        with open(built_main_main, mode='w+') as file_built_index:
            index_lines = file_index.readlines()

            started_css = False
            started_js = False

            for line in index_lines:
                if line.strip() == end_css:
                    started_css = False
                    file_built_index.write(build_css_file(new_css_file_content))
                elif line.strip() == end_js:
                    started_js = False
                    file_built_index.write(build_js_file(new_js_file_content))

                if started_css == True:
                    new_css_file_content = append_css_line(line, new_css_file_content)
                elif started_js == True:
                    new_js_file_content = append_js_line(line, new_js_file_content)
                elif not (line.strip() == end_css or line.strip() == end_js or line.strip() == start_css or line.strip() == start_js):
                    file_built_index.write(line)

                if line.strip() == start_css:
                    started_css = True
                elif line.strip() == start_js:
                    started_js = True

    build_web_app_pages()

    copy_tree('./img', './build/img')
    copy_tree('./scripts/libraries', './build/scripts/libraries')
    copy2('./Dockerfile', './build/Dockerfile')
    copy2('./serve.json', './build/serve.json')

if __name__ == '__main__':
    main_file = 'index.html'

    if check_if_file_exists(main_file):
        build_web_app(main_file)
    else:
        print('\"index.html\" file not found!')
