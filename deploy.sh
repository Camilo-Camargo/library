#!/bin/bash

TEMP_DIR="deployment"
ZIP_FILE="deployment.zip"
FILES=("startup.sh" "compose.yml" ".env" "api/build/libs/library-0.0.1-SNAPSHOT.jar" "Dockerfile")

mkdir -p "$TEMP_DIR"

for FILE in "${FILES[@]}"; do
  if [[ ! -f $FILE ]]; then
    echo "Error: $FILE does not exist."
    rm -rf "$TEMP_DIR"
    exit 1
  fi
  cp "$FILE" "$TEMP_DIR/"
done

zip -r "$ZIP_FILE" "$TEMP_DIR"

if [[ $? -eq 0 ]]; then
  echo "Successfully created $ZIP_FILE."
else
  echo "Error: Failed to create $ZIP_FILE."
fi

rm -rf "$TEMP_DIR"
