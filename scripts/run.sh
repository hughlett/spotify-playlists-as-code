docker build . -t spac && \
docker run -v $(pwd)/tokens:/tokens:rw -v $(pwd)/data:/spac/data:rw -p 5173:5173 --rm spac