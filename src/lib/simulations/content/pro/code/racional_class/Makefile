CXX = g++
CXXFLAGS = -D_JUDGE_ -D_GLIBCXX_DEBUG -O2 -Wall -Wextra -Werror -Wno-sign-compare -std=c++11

TARGET = calc_racionals

all: $(TARGET)

$(TARGET): racional.o main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) racional.o main.o

racional.o: racional.cc racional.hh
	$(CXX) $(CXXFLAGS) -c racional.cc

main.o: main.cc racional.hh
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)