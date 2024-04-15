docker build . -t spac && \
docker run -v $(pwd)/tokens:/tokens -v $(pwd)/data:/spac/data -p 5173:5173 --rm spac