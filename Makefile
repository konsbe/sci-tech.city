build-img::
	sudo docker build --network host -t sci-tech-city-web:18-alpine .
run:
	sudo docker run -it -dp 3000:3000 --network host sci-tech-city-web:18-alpine

