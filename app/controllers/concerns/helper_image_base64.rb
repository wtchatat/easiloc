def file_decode(base, filename)
    file = Tempfile.new([file_base_name(filename), file_extn_name(filename)])
    file.binmode
    file.write(Base64.decode64(base))
    file.close
    file
end

def file_base_name(file_name)
    File.basename(file_name, file_extn_name(file_name))
end

def file_extn_name(file_name)
    File.extname(file_name)
end

def change_img_params(img)
begin
  Base64.decode64(img) #To check if thats a base64 string
  if img
    img = file_decode(img.split(',')[1],"some file name") #getting only the string leaving out the data/<format>
  end
rescue Exception => e
  img #Returning if its not a base64 string
end
end
