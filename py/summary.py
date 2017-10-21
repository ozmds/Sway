import math

'''
method_list entry
[methodname, startline, endline, longestwidth, description]

class_list entry
[methodname, startline, endline]
'''

OPEN_CURL = '{'
CLOSE_CURL = '}'

OPEN_PAR = '('
CLOSE_PAR = ')'

FILE_PATH = '../js/'
file_list = []

FILE_DEST_PATH = '../docs/'

file_list.append('circle.js')
file_list.append('constants.js')
file_list.append('game.js')
file_list.append('imageset.js')
file_list.append('line.js')
file_list.append('main.js')
file_list.append('orb.js')
file_list.append('orblist.js')
file_list.append('pendulum.js')
file_list.append('screen.js')

table_id = 1

def createTableHeader(fp, hlist):
    fp.write(70 * '-' + '\n')
    for h in hlist:
        fp.write(centerString(h[0], h[1]))
        if h == hlist[-1]:
            fp.write('\n')
        else:
            fp.write('|')
    fp.write(70 * '-' + '\n')

def createFileHeader(fp, fname):
    fp.write(70 * '-' + '\n')
    fp.write('Name of File: ' + fname + '\n')
    fp.write(70 * '-' + '\n')

def writeNOL(fp, m):
    fp.write(centerString(str(m[2] - m[1] + 1), 17))

def writeMaxLength(fp, m):
    fp.write(centerString(str(m[3]), 20))

def writeMethodList(fp, mlist):
    for m in mlist:
        m[0] = m[0][:findOpenPar(m[0])]
        m[0] = m[0].strip()
        if len(m[0]) > 30:
            fp.write(m[0][:20] + ': TOO LONG')
        else:
            fp.write(centerString(m[0], 31))

        fp.write('|')

        if table_id == 1:
            writeDesc(fp, m[4])
        if table_id == 2:
            writeNOL(fp, m)
            fp.write('|')
            writeMaxLength(fp, m)
        
        fp.write('\n')

def createLineList(file_path):
    fr = open(file_path, 'r')
    line_list = fr.readlines()
    fr.close()
    return line_list

def createSummary(fp, lcount, ccount, mcount):
    fp.write('Number of Lines: ' + str(lcount) + '\n')
    fp.write('Number of Classes: ' + str(ccount) + '\n')
    fp.write('Number of Methods: ' + str(mcount) + '\n')

def centerString(s, n):
    return s.rjust(math.floor((n - len(s)) / 2) + len(s)).ljust(n)

def writeDesc(fp, slist):
    if len(slist) == 1:
        fp.write(centerString(slist[0], 38))
    else:
        fp.write(' ' + slist[0])
        for s in range(len(slist) - 1):
            fp.write('\n')
            fp.write(' ' * 31 + '| ')
            fp.write(slist[s + 1])
            
def splitComment(word):
    old_list = word.split()
    new_list = []
    new_word = ''
    count = 0
    i = 0

    while i < len(old_list):
        if new_word == '':
            if len(old_list[i]) + count < 37:
                count += len(old_list[i])
                new_word = new_word + old_list[i]
                i += 1
        else:           
            if len(old_list[i]) + count + 1 < 37:
                count += len(old_list[i]) + 1
                new_word = new_word + ' ' + old_list[i]
                i += 1
            else:
                new_list.append(new_word)
                new_word = ''
                count = 0

    if new_word == '':
        pass
    else:
        new_list.append(new_word)
        new_word = ''
        count = 0

    return new_list
    
def findOpenPar(s):
    for i in range(len(s)):
        if s[i] == OPEN_PAR:
            return i

def createComment(ind, llist):
    if ind == []:
        return 'DOES NOT EXIST'
    else:
        c = ''
        i = ind[0]
        while i <= ind[1]:
            c = c + llist[i].strip() + ' '
            i += 1

        c = c.replace('/*', '')
        c = c.replace('*/', '')
        c = c.strip()
        
        return c

def calcStringLength(s):
    total = 0
    for char in s:
        if char == '\n':
            pass
        elif char == '\t':
            total += 4
        else:
            total += 1

    return total

for file in file_list:
    curl_count = 0
    method_list = []
    class_list = []

    line_list = createLineList(FILE_PATH + file)
    
    fw = open(FILE_DEST_PATH + file[:-3] + '-summary.txt', 'w')

    createFileHeader(fw, file)

    max_length = 0
    max_out_length = 0
    check_comment = False
    comment_ind = []
    comment = ''

    for i in range(len(line_list)):
        if curl_count == 0:
            # if class in in the line
            if line_list[i][:5] == 'class':
                class_list.append([line_list[i][6:findOpenPar(line_list[i])]])
                class_list[-1].append(i)
        if len(class_list) > 0 and len(class_list[-1]) == 2:
            # if enclosed in a class
            if check_comment:
                if '/*' in line_list[i]:
                    comment_ind.append(i)
                if '*/' in line_list[i]:
                    comment_ind.append(i)
                    check_comment = False
                    
            max_length = max(max_length, calcStringLength(line_list[i]))
            if CLOSE_CURL in line_list[i]:
                curl_count -= 1
                #closing curl of a method
                if curl_count == 1:
                    method_list[-1].append(i)
                    method_list[-1].append(max_length)
                    if comment_ind:
                        if comment_ind[0] != (method_list[-1][1] + 1):
                            comment_ind = []
                    comment = createComment(comment_ind, line_list)
                    comment = splitComment(comment)
                    method_list[-1].append(comment)
                    comment = ''
                    comment_ind = []
                    max_length = 0
                #closing curl of a class
                if curl_count == 0:
                    if len(class_list[-1]) == 2:
                        class_list[-1].append(i)
            if OPEN_CURL in line_list[i]:
                curl_count += 1
                # opening curl of a method
                if curl_count == 2:
                    method_list.append([line_list[i]])
                    method_list[-1].append(i)
                    check_comment = True
        else:
            max_out_length = max(max_out_length, calcStringLength(line_list[i]))
    createSummary(fw, len(line_list), len(class_list), len(method_list))

    createTableHeader(fw, [('Method Name', 31), ('Description', 38)])

    table_id = 1

    writeMethodList(fw, method_list)

    createTableHeader(fw, [('Method Name', 31), ('Number of Lines', 17),
                           ('Longest Line Width', 20)])        

    table_id = 2

    writeMethodList(fw, method_list)

    fw.write(centerString('Lines Outside of Class: ', 31) + '|')

    class_total = 0
    for c in class_list:
        class_total += c[2] - c[1] + 1
    
    fw.write(centerString(str(len(line_list) - class_total), 17) + '|')
    fw.write(centerString(str(max_out_length), 20) + '\n')

    fw.close()    
