CXX = g++
CXX_FLAGS = -std=c++17

test: test_parentesis
	@./test_parentesis -ni

test_parentesis: test_parentesis.cc parentesis.cc
	$(CXX) $(CXX_FLAGS) -o test_parentesis test_parentesis.cc parentesis.cc