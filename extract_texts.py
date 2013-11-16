import re
import sys
import os

f = open('temp.txt', 'r')
str = f.read()

# Get pages
pages = re.findall(r'\d+-\d+\n+', str)
texts = re.findall(r'\d+-\d+(.*?\d+\([\d\-,]+\)\n+)', str, re.DOTALL)

print 'Found {0} pages'.format(len(pages))
print 'Found {0} texts'.format(len(texts))


if len(pages) != len(texts):
    print "Error, expected equal number of pages and texts"
    sys.exit(0)

for i in range(len(pages)):
    page = pages[i].split('-')[0]
    text = os.linesep.join([s for s in texts[i].splitlines() if s.isspace() == False])
    print '<div id="page{0}" style="display: none;">'.format(page)
    print text.replace('\n', '\n\t')
    print '</div>'
