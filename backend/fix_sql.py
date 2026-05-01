import re

with open('update_unique_images.sql', 'r') as f:
    content = f.read()

# Pattern:
# -- 1. Skylark Floor Lamp
# UPDATE products
# SET image_url = '...'
# WHERE id = 1;

# We want to change the WHERE id = X; to WHERE name = 'Skylark Floor Lamp';
blocks = content.split(';')
new_blocks = []

for block in blocks:
    if not block.strip():
        continue
    if block.strip() == 'COMMIT':
        new_blocks.append(block)
        continue
    
    # Extract name from comment
    match = re.search(r'-- \d+\. (.+)\n', block)
    if match:
        name = match.group(1).strip()
        # Replace WHERE id = ... with WHERE name = '...'
        new_block = re.sub(r'WHERE id = \d+', f"WHERE name = '{name}'", block)
        new_blocks.append(new_block)
    else:
        new_blocks.append(block)

with open('update_unique_images.sql', 'w') as f:
    f.write(';'.join(new_blocks) + ';')

