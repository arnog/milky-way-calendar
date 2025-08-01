# Test Suite

This directory contains comprehensive unit tests for the Milky Way Calendar's astronomy calculations.

## Test Files

### Core Astronomy Calculations
- **`galacticCenter.test.ts`** - Tests for Galactic Core position, rise/set times, and visibility calculations
- **`moonCalculations.test.ts`** - Tests for moon phase, illumination, interference, and rise/set calculations  
- **`twilightCalculations.test.ts`** - Tests for twilight times (civil, astronomical) and dark duration calculations
- **`optimalViewing.test.ts`** - Tests for optimal viewing window calculations combining GC, moon, and twilight data
- **`visibilityRating.test.ts`** - Tests for the 1-4 star visibility rating system

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once (non-watch mode)  
npm run test:run

# Run specific test file
npm test galacticCenter

# Run with coverage
npm test -- --coverage
```

## Test Coverage

The test suite covers:
- ✅ **Galactic Core calculations** - Position, altitude, rise/set times, seasonal thresholds
- ✅ **Moon calculations** - Phase, illumination, interference factors  
- ✅ **Twilight calculations** - Civil/astronomical twilight, dark duration
- ✅ **Optimal viewing windows** - Integration of GC visibility, darkness, and moon interference
- ✅ **Visibility ratings** - 1-4 star system based on viewing conditions
- ✅ **Edge cases** - High latitudes, extreme dates, boundary conditions
- ✅ **Error handling** - Graceful handling of calculation failures

## Test Philosophy

Tests focus on:
1. **Correctness** - Astronomy calculations return reasonable values
2. **Consistency** - Same inputs produce same outputs  
3. **Edge cases** - Handle extreme locations, dates, and conditions
4. **Integration** - Components work together correctly
5. **Performance** - Tests run quickly for fast feedback

All tests use realistic astronomy data and verify that calculations produce scientifically reasonable results for Milky Way observation planning.