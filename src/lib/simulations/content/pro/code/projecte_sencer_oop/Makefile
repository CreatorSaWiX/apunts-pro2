CXX = g++
CXXFLAGS = -Wall -std=c++17

program: main.o Punt.o
	$(CXX) -o program main.o Punt.o

main.o: main.cc Punt.hpp
	$(CXX) $(CXXFLAGS) -c main.cc
	
Punt.o: Punt.cpp Punt.hpp
	$(CXX) $(CXXFLAGS) -c Punt.cpp