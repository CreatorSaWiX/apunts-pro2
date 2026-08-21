CXX = g++
CXX_FLAGS = -std=c++17

test: test_recursivitat
	@./test_recursivitat -ni

test_recursivitat: test_recursivitat.cc recursivitat.cc
	$(CXX) $(CXX_FLAGS) -o test_recursivitat test_recursivitat.cc recursivitat.cc