package com.learn.library.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.learn.library.interfaces.IUserService;
import com.learn.library.model.User;
import com.learn.library.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
	@Autowired
	private UserRepository userRepository;

	@Override
	public User create(User user) {
		return this.userRepository.save(user);
	}

	@Override
	public void delete(User user) {
		this.userRepository.delete(user);
	}

	@Override
	public User login(String username, String password) {
		return (User) this.userRepository.findUserByUsernameAndPassword(username, password);
	}

	@Override
	public User findById(Long id) {
		Optional<User> user = this.userRepository.findById(id);

		if (user.isEmpty())
			return null;

		return user.get();
	}

	@Override
	public List<User> findAll() {
		return userRepository.findAll();
	}

	@Override
	public String generateUsername(String fullname, String identification) {
		String[] nameParts = fullname.trim().split("\\s+");
		String firstName = nameParts[0];
		String lastName = (nameParts.length > 1) ? nameParts[nameParts.length - 1] : "";
		String username = firstName.charAt(0) + lastName + identification;
		return username.toLowerCase().trim();
	}

	@Override
	public User update(User user) {
		return this.userRepository.save(user);
	}

}