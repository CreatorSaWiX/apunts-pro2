CXX = g++
CXX_FLAGS = -std=c++17

test: test_patata_calenta
	@./test_patata_calenta -ni

test_patata_calenta: test_patata_calenta.cc patata_calenta.cc
	$(CXX) $(CXX_FLAGS) -o test_patata_calenta test_patata_calenta.cc patata_calenta.cc