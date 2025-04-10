from PIL import Image

item_list = ['restart.png']

for item in item_list:
    icon = Image.open(item)
    icon = icon.convert('RGBA')
    icon_data = icon.load()

    # Change all the icons to white with clear backgrounds
    
    for y in range(icon.size[1]):
        for x in range(icon.size[0]):
            if icon_data[x, y][3] > 200:
                icon_data[x, y] = (255, 255, 255, 255)
            else:
                icon_data[x, y] = (0, 0, 255, 0)

    filled_columns = []

    for x in range(icon.size[0]):
        for y in range(icon.size[1]):
            if icon_data[x, y] == (255, 255, 255, 255):
                filled_columns.append(x)
                break

    icon = icon.crop((min(filled_columns), 0, max(filled_columns) + 1, icon.size[1]))

    aspect_ratio = icon.size[1] / icon.size[0]

    icon = icon.resize((512, round(aspect_ratio * 512)))

    icon.save('new' + item)
    
