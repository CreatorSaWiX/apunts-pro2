CXX = g++
CXX_FLAGS = -std=c++17

test: test_reverse
	@./test_reverse -ni

test_reverse: test_reverse.cc reverse.cc
	$(CXX) $(CXX_FLAGS) -o test_reverse test_reverse.cc reverse.cc