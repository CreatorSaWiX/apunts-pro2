CXX = g++
CXXFLAGS = -D_JUDGE_ -D_GLIBCXX_DEBUG -O2 -Wall -Wextra -Werror -Wno-sign-compare -std=c++11

TARGET = demo_data

all: $(TARGET)

$(TARGET): data.o main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) data.o main.o

data.o: data.cc data.hh
	$(CXX) $(CXXFLAGS) -c data.cc

main.o: main.cc data.hh
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)