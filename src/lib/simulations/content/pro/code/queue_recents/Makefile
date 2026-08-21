CXX = g++
CXX_FLAGS = -std=c++17

test: test_compta_recents
	@./test_compta_recents -ni

test_compta_recents: test_compta_recents.cc compta_recents.cc
	$(CXX) $(CXX_FLAGS) -o test_compta_recents test_compta_recents.cc compta_recents.cc