#!/usr/bin/python3
import sys
import json
for line in sys.stdin:
    data = json.loads(line)
    data['value'] = data['value'].upper()
    sys.stdout.write(json.dumps(data))
