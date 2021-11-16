package com.jaya.fridge;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;

@DataJpaTest
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class FridgeServiceTests {
  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private FridgeRepository fridgeRepository;

  @Autowired
  private UserRepository userRepository;

  @Test
  void testUpdateFoodNewFood() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 1234L, "chocolate");
    Optional<Food> food = this.fridgeRepository.findUsersFood("chocolate", 1234L);
    Food returnedFood = food.get();
    Food checkFood = new Food(1234L, "chocolate", 5L, 7L);

    assertEquals(checkFood.toString(), returnedFood.toString());
  }

  @Test
  void testUpdateFoodUpdateFoodQuantity() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 1234L, "chocolate");
    fridge.updateFood(new UpdateQuantity(12L, 8L), 1234L, "chocolate");
    fridge.updateFood(new UpdateQuantity(13L, 9L), 1234L, "chocolate");

    Optional<Food> food = this.fridgeRepository.findUsersFood("chocolate", 1234L);
    Food returnedFood = food.get();
    Food checkFood = new Food(1234L, "chocolate", 30L, 9L);

    assertEquals(checkFood.toString(), returnedFood.toString());
  }

  @Test
  void testGetFridge() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 1234L, "chocolate");
    fridge.updateFood(new UpdateQuantity(10L, 9L), 1234L, "cherry");
    fridge.updateFood(new UpdateQuantity(15L, 8L), 1234L, "apple");

    Food food1 = new Food(1234L, "chocolate", 5L, 7L);
    Food food2 = new Food(1234L, "cherry", 10L, 9L);
    Food food3 = new Food(1234L, "apple", 15L, 8L);

    ArrayList<Food> list = new ArrayList<>();
    list.add(food1);
    list.add(food2);
    list.add(food3);

    assertEquals(list.toString(), fridge.getFridge(1234L).toString());
  }

  @Test
  void testGetFridgeAll() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 781L, "chocolate");
    fridge.updateFood(new UpdateQuantity(10L, 9L), 2211L, "cherry");
    fridge.updateFood(new UpdateQuantity(15L, 8L), 4L, "apple");

    Food food1 = new Food(781L, "chocolate", 5L, 7L);
    Food food2 = new Food(2211L, "cherry", 10L, 9L);
    Food food3 = new Food(4L, "apple", 15L, 8L);

    ArrayList<Food> list = new ArrayList<>();
    list.add(food1);
    list.add(food2);
    list.add(food3);

    assertEquals(list.toString(), fridge.getFridgeAll().toString());
  }

  @Test
  void testMissingCore() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 1234L, "chocolate");
    fridge.updateFood(new UpdateQuantity(10L, 30L), 1234L, "cherry");
    fridge.updateFood(new UpdateQuantity(15L, 8L), 1234L, "apple");

    Food food1 = new Food(1234L, "chocolate", 5L, 7L);
    Food food2 = new Food(1234L, "cherry", 10L, 30L);
    Food food3 = new Food(1234L, "test", 10L, 30L);

    ArrayList<Food> list = new ArrayList<>();
    list.add(food1);
    list.add(food2);

    assertEquals(list.toString(), fridge.missingCore(1234L).toString());
  }

  @Test
  void testHasCore() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 1234L, "chocolate");
    Optional<Food> food = this.fridgeRepository.findUsersFood("chocolate", 1234L);
    Food returnedFood = food.get();

    assertEquals(false, fridge.hasCoreFood(returnedFood));

  }

  @Test
  void testAddUser() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);
    User user = new User(1234L);

    assertEquals(true, fridge.addUser(user));
  }

  @Test
  void testDeleteUser() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);
    User user = new User(1234L);
    fridge.addUser(user);
    fridge.deleteUser(1234L);
    ArrayList<User> returnedList = (ArrayList<User>) userRepository.findUser(1234L);

    assertEquals(0, returnedList.size());
  }

  @Test
  void testDeleteItem() throws Exception {
    FridgeService fridge = new FridgeService(fridgeRepository, userRepository);

    fridge.updateFood(new UpdateQuantity(5L, 7L), 1234L, "chocolate");
    fridge.updateFood(new UpdateQuantity(10L, 9L), 1234L, "cherry");
    fridge.updateFood(new UpdateQuantity(15L, 8L), 1234L, "apple");

    fridge.deleteItem(1234L, "apple");

    Food food1 = new Food(1234L, "chocolate", 5L, 7L);
    Food food2 = new Food(1234L, "cherry", 10L, 9L);

    ArrayList<Food> list = new ArrayList<>();
    list.add(food1);
    list.add(food2);

    assertEquals(list.toString(), fridge.getFridge(1234L).toString());
  }

}

